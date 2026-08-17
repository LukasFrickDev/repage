import os
import sys
from pathlib import Path

import django
from django.core.management import call_command


APP_ROOT = Path(__file__).resolve().parents[1]
if str(APP_ROOT) not in sys.path:
    sys.path.insert(0, str(APP_ROOT))


ALLOWED_JOBS = {
    'process_email_retries': 'process_email_retries',
    'cleanup_idempotency': 'cleanup_idempotency',
}


def run_job(job_name: str) -> None:
    command_name = ALLOWED_JOBS.get(job_name)
    if command_name is None:
        raise ValueError('unsupported production cron job')
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    call_command(command_name)
