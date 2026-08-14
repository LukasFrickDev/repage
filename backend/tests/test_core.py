from unittest.mock import patch

import pytest
from django.db import OperationalError
from django.test import Client


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
