import logging
import math
import uuid
from datetime import datetime, timedelta

from django.conf import settings
from django.db import DatabaseError, IntegrityError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EmailDelivery, IdempotencyRecord, Lead
from .protection import (
    ProtectionUnavailable,
    RateLimitExceeded,
    apply_contact_rate_limits,
    apply_ip_rate_limits,
)
from .security import protected_fingerprint
from .serializers import LeadSerializer


logger = logging.getLogger(__name__)
SUCCESS_PAYLOAD = {'status': 'received', 'message': 'Recebemos sua solicitação.'}


def error_response(code, message, request_id, fields=None, http_status=status.HTTP_400_BAD_REQUEST, headers=None):
    error = {'code': code, 'message': message}
    if fields:
        error['fields'] = fields
    response = Response({'error': error, 'request_id': str(request_id)}, status=http_status)
    for name, value in (headers or {}).items():
        response[name] = str(value)
    return response


def contains_error_code(errors, code):
    if isinstance(errors, dict):
        return any(contains_error_code(value, code) for value in errors.values())
    if isinstance(errors, (list, tuple)):
        return any(contains_error_code(value, code) for value in errors)
    return getattr(errors, 'code', None) == code


def parse_submission_started(value):
    if not isinstance(value, str) or not value.strip():
        return None
    try:
        parsed = datetime.fromisoformat(value.strip().replace('Z', '+00:00'))
    except ValueError:
        return None
    return None if timezone.is_naive(parsed) else parsed


def fingerprint_for_values(values):
    return protected_fingerprint(
        {
            'name': values['name'],
            'email': values['email'],
            'whatsapp': values['whatsapp'],
            'project_type': values['project_type'],
            'business_name': values.get('business_name', ''),
            'message': values.get('message', ''),
            'privacy_policy_acknowledged': values['privacy_policy_acknowledged'],
            'privacy_policy_version': values['privacy_policy_version'],
            'source': values['source'],
        },
        purpose='lead-fingerprint',
    )


def response_for_record(record, request_id):
    payload = dict(record.response_payload)
    payload['request_id'] = str(request_id)
    return Response(payload, status=record.response_status)


def resolve_existing_record(key, fingerprint, request_id):
    record = IdempotencyRecord.objects.filter(key=key, expires_at__gt=timezone.now()).first()
    if record is None:
        return None
    if record.fingerprint != fingerprint:
        return error_response(
            'idempotency_conflict',
            'A tentativa informada conflita com uma solicitação anterior.',
            request_id,
            http_status=status.HTTP_409_CONFLICT,
        )
    return response_for_record(record, request_id)


def find_duplicate_lead(values, fingerprint):
    cutoff = timezone.now() - timedelta(seconds=settings.LEAD_DUPLICATE_WINDOW_SECONDS)
    candidates = Lead.objects.filter(
        source=Lead.Source.WEBSITE,
        email=values['email'],
        created_at__gte=cutoff,
    )
    for lead in candidates:
        lead_values = {
            'name': lead.name,
            'email': lead.email,
            'whatsapp': lead.whatsapp,
            'project_type': lead.project_type,
            'business_name': lead.business_name,
            'message': lead.message,
            'privacy_policy_acknowledged': lead.privacy_policy_acknowledged,
            'privacy_policy_version': lead.privacy_policy_version,
            'source': lead.source,
        }
        if fingerprint_for_values(lead_values) == fingerprint:
            return lead
    return None


class LeadCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        request_id = request.request_id
        if request.data.get('company_website', ''):
            return error_response(
                'invalid_submission',
                'Não foi possível processar sua solicitação.',
                request_id,
            )

        started_at = parse_submission_started(request.data.get('form_started_at'))
        if started_at is None:
            return error_response(
                'submission_too_fast',
                'Aguarde um momento e tente novamente.',
                request_id,
                http_status=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={'Retry-After': settings.LEAD_MIN_SUBMISSION_SECONDS},
            )
        elapsed = (timezone.now() - started_at).total_seconds()
        if elapsed < settings.LEAD_MIN_SUBMISSION_SECONDS:
            retry_after = max(1, math.ceil(settings.LEAD_MIN_SUBMISSION_SECONDS - elapsed))
            return error_response(
                'submission_too_fast',
                'Aguarde um momento e tente novamente.',
                request_id,
                http_status=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={'Retry-After': retry_after},
            )

        raw_key = request.headers.get('Idempotency-Key', '').strip()
        if not raw_key:
            return error_response('idempotency_key_required', 'A chave da tentativa é obrigatória.', request_id)
        try:
            idempotency_key = uuid.UUID(raw_key)
        except (ValueError, AttributeError):
            return error_response('idempotency_key_invalid', 'A chave da tentativa é inválida.', request_id)

        serializer = LeadSerializer(data=request.data)
        is_valid = serializer.is_valid()
        if not is_valid:
            try:
                apply_ip_rate_limits(ip=request.META.get('REMOTE_ADDR', ''), settings=settings)
            except RateLimitExceeded as exc:
                return error_response(
                    'rate_limited',
                    'Tente novamente mais tarde.',
                    request_id,
                    http_status=status.HTTP_429_TOO_MANY_REQUESTS,
                    headers={'Retry-After': exc.retry_after},
                )
            except ProtectionUnavailable:
                logger.error('lead_protection_unavailable', extra={'request_id': str(request_id)})
                return error_response(
                    'service_unavailable',
                    'Não foi possível processar sua solicitação agora.',
                    request_id,
                    http_status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            error_code = (
                'privacy_policy_version_mismatch'
                if contains_error_code(serializer.errors, 'privacy_policy_version_mismatch')
                else 'validation_error'
            )
            return error_response(
                error_code,
                'Revise os campos informados.' if error_code == 'validation_error' else 'Atualize a página e tente novamente.',
                request_id,
                serializer.errors,
            )

        values = dict(serializer.validated_data)
        values.pop('company_website', None)
        values.pop('form_started_at', None)
        fingerprint = fingerprint_for_values(values)
        existing_response = resolve_existing_record(idempotency_key, fingerprint, request_id)
        if existing_response is not None:
            return existing_response

        try:
            apply_ip_rate_limits(
                ip=request.META.get('REMOTE_ADDR', ''),
                settings=settings,
            )
        except RateLimitExceeded as exc:
            return error_response(
                'rate_limited',
                'Tente novamente mais tarde.',
                request_id,
                http_status=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={'Retry-After': exc.retry_after},
            )
        except ProtectionUnavailable:
            logger.error('lead_protection_unavailable', extra={'request_id': str(request_id)})
            return error_response(
                'service_unavailable',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            apply_contact_rate_limits(
                email=values['email'],
                whatsapp=values['whatsapp'],
                settings=settings,
            )
        except RateLimitExceeded as exc:
            return error_response(
                'rate_limited',
                'Tente novamente mais tarde.',
                request_id,
                http_status=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={'Retry-After': exc.retry_after},
            )
        except ProtectionUnavailable:
            logger.error('lead_protection_unavailable', extra={'request_id': str(request_id)})
            return error_response(
                'service_unavailable',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        duplicate = find_duplicate_lead(values, fingerprint)
        expires_at = timezone.now() + timedelta(seconds=settings.IDEMPOTENCY_TTL_SECONDS)
        try:
            with transaction.atomic():
                IdempotencyRecord.objects.filter(
                    key=idempotency_key,
                    expires_at__lte=timezone.now(),
                ).delete()
                if duplicate is None:
                    lead = Lead.objects.create(**values)
                    EmailDelivery.objects.bulk_create([
                        EmailDelivery(lead=lead, kind=EmailDelivery.Kind.INTERNAL_NOTIFICATION),
                        EmailDelivery(lead=lead, kind=EmailDelivery.Kind.VISITOR_CONFIRMATION),
                    ])
                else:
                    lead = duplicate
                IdempotencyRecord.objects.create(
                    key=idempotency_key,
                    fingerprint=fingerprint,
                    lead=lead,
                    response_status=status.HTTP_201_CREATED,
                    response_payload=SUCCESS_PAYLOAD,
                    expires_at=expires_at,
                )
        except IntegrityError:
            existing_response = resolve_existing_record(idempotency_key, fingerprint, request_id)
            if existing_response is not None:
                return existing_response
            logger.error('lead_creation_integrity_failed', extra={'request_id': str(request_id)})
            return error_response(
                'server_error',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except DatabaseError:
            logger.error('lead_persistence_failed', extra={'request_id': str(request_id)})
            return error_response(
                'server_error',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception:
            logger.error('lead_creation_failed', extra={'request_id': str(request_id)})
            return error_response(
                'server_error',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        payload = dict(SUCCESS_PAYLOAD)
        payload['request_id'] = str(request_id)
        return Response(payload, status=status.HTTP_201_CREATED)
