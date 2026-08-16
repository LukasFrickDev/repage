import os
import subprocess
import sys
from unittest.mock import patch
from pathlib import Path

import pytest
from django.db import OperationalError
from django.conf import settings
from django.test import Client

from apps.leads.protection import ProtectionUnavailable
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


def load_settings_with_environment(**overrides):
    environment = os.environ.copy()
    for name in (
        'DJANGO_ENVIRONMENT',
        'DJANGO_SECRET_KEY',
        'DJANGO_DEBUG',
        'DJANGO_ALLOWED_HOSTS',
        'DJANGO_CORS_ALLOWED_ORIGINS',
        'PRIVACY_POLICY_VERSION',
        'POSTGRES_DB',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_HOST',
        'POSTGRES_PORT',
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
        [sys.executable, '-c', 'import config.settings'],
        cwd=BACKEND_DIR,
        env=environment,
        capture_output=True,
        text=True,
        check=False,
    )


def test_development_keeps_local_configuration_defaults():
    result = load_settings_with_environment(DJANGO_ENVIRONMENT='development')

    assert result.returncode == 0, result.stderr


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


@pytest.mark.parametrize(
    'missing_name',
    [
        'DJANGO_SECRET_KEY',
        'DJANGO_DEBUG',
        'DJANGO_ALLOWED_HOSTS',
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
        'EMAIL_PORT': '587',
        'EMAIL_HOST_USER': 'smtp-user',
        'EMAIL_HOST_PASSWORD': 'production-only-test-password',
        'EMAIL_USE_TLS': 'True',
        'EMAIL_USE_SSL': 'False',
        'EMAIL_TIMEOUT': '5',
    }
    production_environment.pop(missing_name)

    result = load_settings_with_environment(**production_environment)

    assert result.returncode != 0
    assert missing_name in result.stderr
