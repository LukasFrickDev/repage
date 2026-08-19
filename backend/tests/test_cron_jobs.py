from pathlib import Path
from unittest.mock import patch

import pytest

from scripts import cron_jobs


def test_cron_jobs_are_allowlisted():
    assert cron_jobs.ALLOWED_JOBS == {
        'process_email_retries': 'process_email_retries',
        'cleanup_idempotency': 'cleanup_idempotency',
    }

    with pytest.raises(ValueError):
        cron_jobs.run_job('arbitrary_command')


@pytest.mark.parametrize('job_name, command_name', [
    ('process_email_retries', 'process_email_retries'),
    ('cleanup_idempotency', 'cleanup_idempotency'),
])
def test_allowlisted_cron_job_calls_only_expected_management_command(job_name, command_name):
    with patch.object(cron_jobs.django, 'setup') as setup, patch.object(
        cron_jobs, 'call_command'
    ) as call_command:
        cron_jobs.run_job(job_name)

    setup.assert_called_once_with()
    call_command.assert_called_once_with(command_name)


def test_cron_wrapper_uses_selector_parser_and_cleans_temporary_files():
    wrapper = Path(__file__).parents[1] / 'scripts' / 'run_production_cron.sh'
    source = wrapper.read_text(encoding='utf-8')

    assert "process_email_retries)" in source
    assert "cleanup_idempotency)" in source
    assert '--script-name "$script_name"' in source
    assert 'parse_cloudlinux_result.py' in source
    assert '2>"${temporary_dir}/selector.err"' in source
    assert 'rm -rf -- "$temporary_dir"' in source
    assert 'Production cron job failed:' in source
    assert 'Production cron job succeeded:' in source


def test_uptime_workflow_checks_homepage_and_health_only():
    workflow = Path(__file__).parents[2] / ".github" / "workflows" / "uptime.yml"
    source = workflow.read_text(encoding="utf-8")

    assert "https://repage.com.br/" in source
    assert "https://api.repage.com.br/health/" in source
    assert "/health/ready/" not in source
