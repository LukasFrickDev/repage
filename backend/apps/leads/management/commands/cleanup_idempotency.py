from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.leads.models import IdempotencyRecord, RateLimitCounter


class Command(BaseCommand):
    help = 'Remove registros de idempotência e contadores de proteção expirados.'

    def handle(self, *args, **options):
        now = timezone.now()
        deleted_idempotency, _ = IdempotencyRecord.objects.filter(expires_at__lte=now).delete()
        deleted_counters, _ = RateLimitCounter.objects.filter(expires_at__lte=now).delete()
        deleted = deleted_idempotency + deleted_counters
        self.stdout.write(str(deleted))
