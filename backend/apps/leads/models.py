import uuid

from django.db import models
from django.utils import timezone


class Lead(models.Model):
    class ProjectType(models.TextChoices):
        LANDING_PAGE = 'landing_page', 'Landing page'
        INSTITUTIONAL_SITE = 'institutional_site', 'Site institucional'
        CUSTOM_SOLUTION = 'custom_solution', 'Solução personalizada'
        SUPPORT_OR_EVOLUTION = 'support_or_evolution', 'Suporte ou evolução'
        NOT_SURE = 'not_sure', 'Ainda não sabe'

    class Status(models.TextChoices):
        NEW = 'new', 'Novo'
        IN_PROGRESS = 'in_progress', 'Em andamento'
        DELIVERED = 'delivered', 'Entregue'
        MAINTENANCE = 'maintenance', 'Manutenção'
        ARCHIVED = 'archived', 'Arquivado'

    class Source(models.TextChoices):
        WEBSITE = 'website', 'Website'
        MANUAL = 'manual', 'Manual'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    email = models.EmailField(max_length=254)
    whatsapp = models.CharField(max_length=16)
    project_type = models.CharField(max_length=32, choices=ProjectType.choices)
    business_name = models.CharField(max_length=160, blank=True, default='')
    message = models.TextField(max_length=4000, blank=True, default='')
    source = models.CharField(max_length=32, choices=Source.choices)
    acquisition_source = models.CharField(max_length=160, blank=True, default='')
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)
    privacy_policy_acknowledged = models.BooleanField(default=False)
    privacy_policy_version = models.CharField(max_length=64, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self) -> str:
        return f'{self.name} — {self.email}'


class EmailDelivery(models.Model):
    class Kind(models.TextChoices):
        INTERNAL_NOTIFICATION = 'internal_notification', 'Notificação interna'
        VISITOR_CONFIRMATION = 'visitor_confirmation', 'Confirmação ao visitante'

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pendente'
        SENT = 'sent', 'Enviado'
        FAILED = 'failed', 'Falhou'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='email_deliveries',
    )
    kind = models.CharField(max_length=32, choices=Kind.choices)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    attempts = models.PositiveIntegerField(default=0)
    next_attempt_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    last_attempt_at = models.DateTimeField(null=True, blank=True)
    last_error_code = models.CharField(max_length=64, blank=True, default='')
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=('lead', 'kind'), name='unique_lead_email_delivery_kind'),
        ]
        indexes = [
            models.Index(fields=('status', 'next_attempt_at'), name='email_delivery_due_idx'),
        ]

    def __str__(self) -> str:
        return self.get_kind_display()


class IdempotencyRecord(models.Model):
    key = models.UUIDField(unique=True)
    fingerprint = models.CharField(max_length=64)
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='idempotency_records',
    )
    response_status = models.PositiveSmallIntegerField()
    response_payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=('expires_at',), name='idempotency_expiry_idx'),
            models.Index(fields=('fingerprint', 'created_at'), name='idempotency_fingerprint_idx'),
        ]


class RateLimitCounter(models.Model):
    key = models.CharField(max_length=128, primary_key=True)
    count = models.PositiveIntegerField()
    expires_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=('expires_at',), name='rate_counter_expiry_idx'),
        ]
