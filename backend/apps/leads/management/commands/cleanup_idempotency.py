from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.leads.models import IdempotencyRecord


class Command(BaseCommand):
    help = 'Remove registros de idempotência expirados.'

    def handle(self, *args, **options):
        deleted, _ = IdempotencyRecord.objects.filter(expires_at__lte=timezone.now()).delete()
        self.stdout.write(str(deleted))
