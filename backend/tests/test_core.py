import json
import logging
import os
import subprocess
import sys
from unittest.mock import patch
from pathlib import Path

import pytest
from django.db import OperationalError
from django.conf import settings
from django.test import Client, RequestFactory

from apps.core.middleware import RequestIDMiddleware
from apps.leads.protection import ProtectionUnavailable
from apps.core.logging import StructuredFormatter, request_id_context
from config import settings as project_settings


BACKEND_DIR = Path(__file__).resolve().parents[1]


@pytest.fixture
def client():
    return Client()


def test_health_returns_simple_success_and_request_id(client):
    response = client.get('/health/')

    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}
    assert response['X-Request-ID']


def test_request_logging_is_correlated_and_sanitized(client, caplog):
    sensitive_value = 'PII-from-test-payload@example.com'

    with caplog.at_level(logging.INFO):
        response = client.post(
            f'/health/?email={sensitive_value}',
            data={'message': sensitive_value},
        )

    request_events = [record for record in caplog.records if record.msg == 'request_completed']
    assert request_events
    event = request_events[-1]
    assert response.status_code == event.status_code == 405
    assert response['X-Request-ID'] == event.request_id
    assert event.method == 'POST'
    assert event.path == '/health/'
    assert event.duration_ms >= 0
    assert sensitive_value not in caplog.text
    assert request_id_context.get() is None


def test_structured_formatter_emits_only_allowlisted_fields():
    record = logging.LogRecord('test', logging.INFO, __file__, 1, 'test_event', (), None)
    record.method = 'GET'
    record.arbitrary_secret = 'must-not-be-serialized'

    payload = json.loads(StructuredFormatter().format(record))

    assert payload['event'] == 'test_event'
    assert payload['method'] == 'GET'
    assert 'arbitrary_secret' not in payload


def test_request_logging_cleans_context_when_downstream_raises(caplog):
    sensitive_value = 'secret-error-payload'

    def raise_error(request):
        raise RuntimeError(sensitive_value)

    request = RequestFactory().get(f'/failure/?value={sensitive_value}')
    middleware = RequestIDMiddleware(raise_error)

    with caplog.at_level(logging.INFO), pytest.raises(RuntimeError):
        middleware(request)

    request_events = [record for record in caplog.records if record.msg == 'request_completed']
    assert request_events[-1].status_code == 500
    assert sensitive_value not in caplog.text
    assert request_id_context.get() is None


def test_readiness_reports_postgres_as_ready(client):
    with patch('apps.core.views.connection.ensure_connection'), patch('apps.core.views.check_cache'):
        response = client.get('/health/ready/')

    assert response.status_code == 200
    assert response.json() == {'status': 'ready'}
    assert response['X-Request-ID']


def test_readiness_hides_database_failure(client):
    with patch('apps.core.views.connection.ensure_connection', side_effect=OperationalError('secret sql details')):
        response = client.get('/health/ready/')

    assert response.status_code == 503
    assert response.json() == {'status': 'unavailable'}
    assert 'secret sql details' not in response.content.decode()


def test_readiness_hides_cache_failure(client):
    with patch('apps.core.views.connection.ensure_connection'), patch(
        'apps.core.views.check_cache', side_effect=ProtectionUnavailable('secret cache details')
    ):
        response = client.get('/health/ready/')

    assert response.status_code == 503
    assert response.json() == {'status': 'unavailable'}
    assert 'secret cache details' not in response.content.decode()


def load_settings_with_environment(code='import config.settings', **overrides):
    environment = os.environ.copy()
    for name in (
        'DJANGO_ENVIRONMENT',
        'DJANGO_SECRET_KEY',
        'DJANGO_DEBUG',
        'DJANGO_LOG_LEVEL',
        'DJANGO_ALLOWED_HOSTS',
        'DJANGO_STATIC_ROOT',
        'DJANGO_CORS_ALLOWED_ORIGINS',
        'PRIVACY_POLICY_VERSION',
        'POSTGRES_DB',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_SSLMODE',
        'EMAIL_FROM_ADDRESS',
        'EMAIL_INTERNAL_RECIPIENT',
        'EMAIL_HOST',
        'EMAIL_PORT',
        'EMAIL_HOST_USER',
        'EMAIL_HOST_PASSWORD',
        'EMAIL_USE_TLS',
        'EMAIL_USE_SSL',
        'EMAIL_TIMEOUT',
        'IDEMPOTENCY_TTL_SECONDS',
        'LEAD_DUPLICATE_WINDOW_SECONDS',
        'LEAD_MIN_SUBMISSION_SECONDS',
        'LEAD_RATE_LIMIT_IP_SHORT_COUNT',
        'LEAD_RATE_LIMIT_IP_SHORT_WINDOW_SECONDS',
        'LEAD_RATE_LIMIT_IP_DAILY_COUNT',
        'LEAD_RATE_LIMIT_IP_DAILY_WINDOW_SECONDS',
        'LEAD_RATE_LIMIT_EMAIL_COUNT',
        'LEAD_RATE_LIMIT_EMAIL_WINDOW_SECONDS',
        'LEAD_RATE_LIMIT_PHONE_COUNT',
        'LEAD_RATE_LIMIT_PHONE_WINDOW_SECONDS',
        'EMAIL_BACKEND',
    ):
        environment.pop(name, None)
    environment.update(overrides)
    return subprocess.run(
        [sys.executable, '-c', code],
        cwd=BACKEND_DIR,
        env=environment,
        capture_output=True,
        text=True,
        check=False,
    )


def test_development_keeps_local_configuration_defaults():
    result = load_settings_with_environment(DJANGO_ENVIRONMENT='development')

    assert result.returncode == 0, result.stderr


def test_development_uses_local_static_root_and_postgres_ssl_default():
    assert project_settings.STATIC_ROOT == BACKEND_DIR / 'staticfiles'
    assert project_settings.DATABASES['default']['OPTIONS'] == {'sslmode': 'prefer'}


def test_development_allows_configuring_postgres_sslmode():
    result = load_settings_with_environment(
        "from config import settings; print(settings.DATABASES['default']['OPTIONS'])",
        DJANGO_ENVIRONMENT='development',
        POSTGRES_SSLMODE='verify-full',
    )

    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == "{'sslmode': 'verify-full'}"


def test_production_applies_static_root_postgres_tls_and_security_hardening():
    result = load_settings_with_environment(
        """
from config import settings
print(settings.STATIC_ROOT)
print(settings.DATABASES['default']['ENGINE'])
print(settings.DATABASES['default']['OPTIONS'])
print(settings.SESSION_COOKIE_SECURE)
print(settings.CSRF_COOKIE_SECURE)
print(settings.SESSION_COOKIE_HTTPONLY)
print(settings.SESSION_COOKIE_SAMESITE)
print(settings.SECURE_SSL_REDIRECT)
print(settings.SECURE_CONTENT_TYPE_NOSNIFF)
print(settings.SECURE_REFERRER_POLICY)
print(settings.X_FRAME_OPTIONS)
print(hasattr(settings, 'SECURE_PROXY_SSL_HEADER'))
print(settings.EMAIL_BACKEND)
print(settings.EMAIL_HOST)
print(settings.EMAIL_PORT)
print(settings.EMAIL_USE_SSL)
print(settings.EMAIL_USE_TLS)
print(settings.EMAIL_TIMEOUT)
""",
        DJANGO_ENVIRONMENT='production',
        DJANGO_SECRET_KEY='x' * 64,
        DJANGO_DEBUG='False',
        DJANGO_ALLOWED_HOSTS='api.example.com',
        DJANGO_LOG_LEVEL='INFO',
        DJANGO_STATIC_ROOT='/srv/repage/static',
        DJANGO_CORS_ALLOWED_ORIGINS='https://repage.com.br',
        DJANGO_CSRF_TRUSTED_ORIGINS='https://repage.com.br',
        PRIVACY_POLICY_VERSION='pre-launch-v1',
        POSTGRES_DB='repage',
        POSTGRES_USER='repage',
        POSTGRES_PASSWORD='dummy-password',
        POSTGRES_HOST='postgres.example.internal',
        POSTGRES_PORT='5432',
        POSTGRES_SSLMODE='disable',
        EMAIL_FROM_ADDRESS='notifications@example.com',
        EMAIL_INTERNAL_RECIPIENT='contact@example.com',
        EMAIL_HOST='smtp.example.internal',
        EMAIL_PORT='465',
        EMAIL_HOST_USER='smtp-user',
        EMAIL_HOST_PASSWORD='dummy-password',
        EMAIL_USE_TLS='False',
        EMAIL_USE_SSL='True',
        EMAIL_TIMEOUT='5',
    )

    assert result.returncode == 0, result.stderr
    assert result.stdout.splitlines() == [
        '/srv/repage/static',
        'django.db.backends.postgresql',
        "{'sslmode': 'require'}",
        'True',
        'True',
        'True',
        'Lax',
        'True',
        'True',
        'same-origin',
        'DENY',
        'False',
        'django.core.mail.backends.smtp.EmailBackend',
        'smtp.example.internal',
        '465',
        'True',
        'False',
        '5',
    ]


def test_phase_one_cache_and_protection_settings():
    assert settings.IDEMPOTENCY_TTL_SECONDS == 86400
    assert settings.LEAD_DUPLICATE_WINDOW_SECONDS == 300
    assert project_settings.CACHES['lead_protection'] == {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'repage_lead_protection_cache',
    }
    assert settings.CACHES['lead_protection']['BACKEND'] == 'django.core.cache.backends.locmem.LocMemCache'
    assert settings.EMAIL_BACKEND == 'django.core.mail.backends.locmem.EmailBackend'
    assert settings.EMAIL_TIMEOUT == 5
    assert settings.EMAIL_DELIVERY_LEASE_SECONDS == 300
    assert settings.EMAIL_RETRY_BATCH_SIZE == 10
    assert settings.EMAIL_RETRY_DELAYS_SECONDS == (900, 3600, 21600, 86400)


def test_settings_reject_invalid_log_level():
    result = load_settings_with_environment(
        DJANGO_ENVIRONMENT='development',
        DJANGO_LOG_LEVEL='TRACE',
    )

    assert result.returncode != 0
    assert 'DJANGO_LOG_LEVEL' in result.stderr


def test_settings_reject_mutually_exclusive_email_security_modes():
    result = load_settings_with_environment(
        DJANGO_ENVIRONMENT='development',
        EMAIL_USE_TLS='True',
        EMAIL_USE_SSL='True',
    )

    assert result.returncode != 0
    assert 'não podem estar ativos simultaneamente' in result.stderr


@pytest.mark.parametrize(
    'missing_name',
    [
        'DJANGO_SECRET_KEY',
        'DJANGO_DEBUG',
        'DJANGO_ALLOWED_HOSTS',
        'DJANGO_STATIC_ROOT',
        'DJANGO_CORS_ALLOWED_ORIGINS',
        'PRIVACY_POLICY_VERSION',
        'POSTGRES_DB',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'EMAIL_FROM_ADDRESS',
        'EMAIL_INTERNAL_RECIPIENT',
    ],
)
def test_production_rejects_missing_critical_configuration(missing_name):
    production_environment = {
        'DJANGO_ENVIRONMENT': 'production',
        'DJANGO_SECRET_KEY': 'production-only-test-secret',
        'DJANGO_DEBUG': 'False',
        'DJANGO_ALLOWED_HOSTS': 'api.example.com',
        'DJANGO_STATIC_ROOT': '/srv/repage/static',
        'DJANGO_CORS_ALLOWED_ORIGINS': 'https://repage.com.br',
        'PRIVACY_POLICY_VERSION': 'pre-launch-v1',
        'POSTGRES_DB': 'repage',
        'POSTGRES_USER': 'repage',
        'POSTGRES_PASSWORD': 'production-only-test-password',
        'POSTGRES_HOST': 'postgres.example.internal',
        'POSTGRES_PORT': '5432',
        'EMAIL_FROM_ADDRESS': 'notifications@example.com',
        'EMAIL_INTERNAL_RECIPIENT': 'contact@example.com',
        'EMAIL_HOST': 'smtp.example.internal',
        'EMAIL_PORT': '465',
        'EMAIL_HOST_USER': 'smtp-user',
        'EMAIL_HOST_PASSWORD': 'production-only-test-password',
        'EMAIL_USE_TLS': 'False',
        'EMAIL_USE_SSL': 'True',
        'EMAIL_TIMEOUT': '5',
    }
    production_environment.pop(missing_name)

    result = load_settings_with_environment(**production_environment)

    assert result.returncode != 0
    assert missing_name in result.stderr
