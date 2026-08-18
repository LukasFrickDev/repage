import logging
import smtplib
import socket
from datetime import timedelta
from email.utils import formataddr

from django.conf import settings
from django.core.mail import EmailMessage, get_connection
from django.db import DatabaseError, transaction
from django.db.models import Q
from django.utils import timezone

from .models import EmailDelivery


logger = logging.getLogger(__name__)
INTERNAL_SUBJECT = '[Repage] Nova solicitação de orçamento'
VISITOR_SUBJECT = 'Recebemos sua solicitação | Repage'
VISITOR_BODY = '''Olá, {name}.

Recebemos sua solicitação e registramos seu contato com a Repage.
Obrigado por escrever.

Esta mensagem confirma apenas o recebimento da solicitação e não representa orçamento ou aceite do projeto.

Repage
Uma nova página para o seu negócio começa aqui.'''
ERROR_CODES = {
    'timeout',
    'connection_error',
    'authentication_error',
    'recipient_refused',
    'send_error',
    'backend_error',
}


def _error_code(error):
    if isinstance(error, (TimeoutError, socket.timeout)):
        return 'timeout'
    if isinstance(error, smtplib.SMTPAuthenticationError):
        return 'authentication_error'
    if isinstance(error, smtplib.SMTPRecipientsRefused):
        return 'recipient_refused'
    if isinstance(error, (ConnectionError, smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected)):
        return 'connection_error'
    if isinstance(error, smtplib.SMTPException):
        return 'send_error'
    return 'backend_error'


def _internal_body(lead):
    lines = [
        f'Nome: {lead.name}',
        f'E-mail: {lead.email}',
        f'WhatsApp: {lead.whatsapp}',
        f'Tipo de projeto: {lead.get_project_type_display()}',
    ]
    if lead.business_name:
        lines.append(f'Negócio: {lead.business_name}')
    if lead.message:
        lines.append(f'Mensagem: {lead.message}')
    lines.extend([
        f'Origem técnica: {lead.get_source_display()}',
        f'Data: {timezone.localtime(lead.created_at).isoformat()} ',
    ])
    return '\n'.join(lines).rstrip()


def build_message(delivery):
    lead = delivery.lead
    if delivery.kind == EmailDelivery.Kind.INTERNAL_NOTIFICATION:
        return EmailMessage(
            subject=INTERNAL_SUBJECT,
            body=_internal_body(lead),
            from_email=formataddr((settings.EMAIL_FROM_NAME, settings.EMAIL_FROM_ADDRESS)),
            to=[settings.EMAIL_INTERNAL_RECIPIENT],
            reply_to=[lead.email],
        )
    if delivery.kind == EmailDelivery.Kind.VISITOR_CONFIRMATION:
        return EmailMessage(
            subject=VISITOR_SUBJECT,
            body=VISITOR_BODY.format(name=lead.name),
            from_email=formataddr((settings.EMAIL_FROM_NAME, settings.EMAIL_FROM_ADDRESS)),
            to=[lead.email],
        )
    raise ValueError('unsupported email delivery kind')


def claim_delivery(delivery_id, *, manual=False):
    now = timezone.now()
    with transaction.atomic():
        queryset = EmailDelivery.objects.select_for_update().select_related('lead').filter(pk=delivery_id)
        if manual:
            queryset = queryset.filter(
                status=EmailDelivery.Status.FAILED,
            ).filter(Q(next_attempt_at__isnull=True) | Q(next_attempt_at__lte=now))
        else:
            queryset = queryset.filter(
                status__in=(EmailDelivery.Status.PENDING, EmailDelivery.Status.FAILED),
                next_attempt_at__isnull=False,
                next_attempt_at__lte=now,
            )
        delivery = queryset.first()
        if delivery is None:
            return None
        delivery.next_attempt_at = now + timedelta(seconds=settings.EMAIL_DELIVERY_LEASE_SECONDS)
        delivery.save(update_fields=('next_attempt_at', 'updated_at'))
        return delivery


def _persist_result(delivery_id, *, success, error_code=None, manual=False):
    now = timezone.now()
    with transaction.atomic():
        delivery = EmailDelivery.objects.select_for_update().get(pk=delivery_id)
        attempts = delivery.attempts + 1
        if success:
            delivery.status = EmailDelivery.Status.SENT
            delivery.attempts = attempts
            delivery.last_attempt_at = now
            delivery.last_error_code = ''
            delivery.sent_at = now
            delivery.next_attempt_at = None
        else:
            delivery.status = EmailDelivery.Status.FAILED
            delivery.attempts = attempts
            delivery.last_attempt_at = now
            delivery.last_error_code = error_code if error_code in ERROR_CODES else 'backend_error'
            delivery.sent_at = None
            delivery.next_attempt_at = None if manual or attempts >= 5 else (
                now + timedelta(seconds=settings.EMAIL_RETRY_DELAYS_SECONDS[attempts - 1])
            )
        delivery.save(update_fields=(
            'status', 'attempts', 'last_attempt_at', 'last_error_code', 'sent_at',
            'next_attempt_at', 'updated_at',
        ))
        return delivery


def process_delivery(delivery_id, *, manual=False, connection=None):
    delivery = claim_delivery(delivery_id, manual=manual)
    if delivery is None:
        return None
    try:
        message = build_message(delivery)
        message.connection = connection
        sent = message.send(fail_silently=False)
        if sent != 1:
            raise RuntimeError('email backend did not accept exactly one message')
    except Exception as error:
        code = _error_code(error)
        logger.error(
            'email_delivery_failed',
            extra={
                'lead_id': str(delivery.lead_id),
                'delivery_id': str(delivery.id),
                'kind': delivery.kind,
                'attempts': delivery.attempts + 1,
                'error_code': code,
            },
        )
        return _persist_result(delivery.id, success=False, error_code=code, manual=manual)
    logger.info(
        'email_delivery_sent',
        extra={
            'lead_id': str(delivery.lead_id),
            'delivery_id': str(delivery.id),
            'kind': delivery.kind,
            'attempts': delivery.attempts + 1,
        },
    )
    return _persist_result(delivery.id, success=True, manual=manual)


def process_manual_delivery(delivery_id):
    return process_delivery(delivery_id, manual=True)


def process_due_deliveries(limit):
    due_ids = list(
        EmailDelivery.objects.filter(
            status__in=(EmailDelivery.Status.PENDING, EmailDelivery.Status.FAILED),
            next_attempt_at__isnull=False,
            next_attempt_at__lte=timezone.now(),
        ).order_by('next_attempt_at').values_list('id', flat=True)[:limit]
    )
    processed = 0
    connection = get_connection(fail_silently=False)
    try:
        connection.open()
        for delivery_id in due_ids:
            try:
                if process_delivery(delivery_id, connection=connection) is not None:
                    processed += 1
            except DatabaseError:
                logger.error('email_delivery_database_error', extra={'delivery_id': str(delivery_id)})
    finally:
        connection.close()
    return processed
