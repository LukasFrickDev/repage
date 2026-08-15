import os
import subprocess
import sys
from unittest.mock import patch
from pathlib import Path

import pytest
from django.db import OperationalError
from django.test import Client


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
    with patch('apps.core.views.connection.ensure_connection'):
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
    }
    production_environment.pop(missing_name)

    result = load_settings_with_environment(**production_environment)

    assert result.returncode != 0
    assert missing_name in result.stderr
