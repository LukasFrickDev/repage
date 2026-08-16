from django.conf import settings
from django.core.management.base import BaseCommand

from apps.leads.email_service import process_due_deliveries


class Command(BaseCommand):
    help = 'Processa um lote finito de deliveries de e-mail devidas.'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=settings.EMAIL_RETRY_BATCH_SIZE)

    def handle(self, *args, **options):
        limit = max(1, options['limit'])
        processed = process_due_deliveries(limit)
        self.stdout.write(f'{processed} deliveries processadas.')
