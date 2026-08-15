import uuid

from django.db import models


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
