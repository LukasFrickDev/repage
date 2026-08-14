import uuid
from datetime import timedelta

import pytest
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.conf import settings
from django.test import Client
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient

from apps.leads.admin import LeadAdmin
from apps.leads.models import Lead
from apps.leads.serializers import LeadSerializer


def payload(**overrides):
    value = {
        'name': '  Ana Souza  ',
        'email': '  ANA@EXEMPLO.COM ',
        'whatsapp': '(11) 99999-9999',
        'project_type': 'institutional_site',
        'business_name': '  Negócio fictício  ',
        'message': '  Primeira linha\r\nsegunda linha  ',
        'privacy_policy_acknowledged': True,
        'privacy_policy_version': settings.PRIVACY_POLICY_VERSION,
        'source': 'website',
    }
    value.update(overrides)
    return value


def test_serializer_normalizes_lead_values():
    serializer = LeadSerializer(data=payload())

    assert serializer.is_valid(), serializer.errors
    assert serializer.validated_data['name'] == 'Ana Souza'
    assert serializer.validated_data['email'] == 'ana@exemplo.com'
    assert serializer.validated_data['whatsapp'] == '+5511999999999'
    assert serializer.validated_data['business_name'] == 'Negócio fictício'
    assert serializer.validated_data['message'] == 'Primeira linha\nsegunda linha'


def test_lead_defaults_choices_and_representation():
    lead = Lead(name='Ana Souza', email='ana@example.com')

    assert lead.status == Lead.Status.NEW
    assert lead.privacy_policy_acknowledged is False
    assert lead.business_name == ''
    assert lead.message == ''
    assert set(Lead.ProjectType.values) == {
        'landing_page',
        'institutional_site',
        'custom_solution',
        'support_or_evolution',
        'not_sure',
    }
    assert set(Lead.Status.values) == {'new', 'archived'}
    assert set(Lead.Source.values) == {'website', 'manual'}
    assert str(lead) == 'Ana Souza — ana@example.com'


@pytest.mark.parametrize(
    'field',
    [
        'name',
        'email',
        'whatsapp',
        'project_type',
        'privacy_policy_acknowledged',
        'privacy_policy_version',
        'source',
    ],
)
def test_serializer_rejects_missing_required_field(field):
    value = payload()
    value.pop(field)
    serializer = LeadSerializer(data=value)

    assert not serializer.is_valid()
    assert field in serializer.errors


def test_serializer_rejects_invalid_project_type_and_source():
    invalid_project_type = LeadSerializer(data=payload(project_type='not_a_project'))
    invalid_source = LeadSerializer(data=payload(source='campaign'))

    assert not invalid_project_type.is_valid()
    assert 'project_type' in invalid_project_type.errors
    assert not invalid_source.is_valid()
    assert 'source' in invalid_source.errors


@pytest.mark.parametrize('value', ['123', '00000000000', '(11) 8888-8888'])
def test_serializer_rejects_invalid_whatsapp(value):
    serializer = LeadSerializer(data=payload(whatsapp=value))

    assert not serializer.is_valid()
    assert 'whatsapp' in serializer.errors


def test_serializer_accepts_international_whatsapp_input():
    serializer = LeadSerializer(data=payload(whatsapp='+55 11 99999-9999'))

    assert serializer.is_valid(), serializer.errors
    assert serializer.validated_data['whatsapp'] == '+5511999999999'


@pytest.mark.parametrize(
    ('field', 'value'),
    [
        ('name', 'x' * 121),
        ('business_name', 'x' * 161),
        ('message', 'x' * 4001),
    ],
)
def test_serializer_enforces_text_limits(field, value):
    serializer = LeadSerializer(data=payload(**{field: value}))

    assert not serializer.is_valid()
    assert field in serializer.errors


def test_serializer_rejects_unknown_field():
    serializer = LeadSerializer(data=payload(unexpected='not accepted'))

    assert not serializer.is_valid()
    assert serializer.errors['unexpected'] == ['Este campo não é permitido.']


def test_serializer_rejects_unacknowledged_or_unknown_policy():
    unacknowledged = LeadSerializer(data=payload(privacy_policy_acknowledged=False))
    outdated = LeadSerializer(data=payload(privacy_policy_version='pre-launch-old'))

    assert not unacknowledged.is_valid()
    assert 'privacy_policy_acknowledged' in unacknowledged.errors
    assert not outdated.is_valid()
    assert outdated.errors['privacy_policy_version'][0].code == 'privacy_policy_version_mismatch'


@pytest.mark.django_db
def test_lead_persists_with_uuid_and_new_status():
    serializer = LeadSerializer(data=payload())
    assert serializer.is_valid(), serializer.errors

    lead = serializer.save()

    assert isinstance(lead.id, uuid.UUID)
    assert lead.status == Lead.Status.NEW
    assert Lead.objects.get(pk=lead.pk).email == 'ana@exemplo.com'


@pytest.mark.django_db
def test_api_creates_lead_and_returns_safe_response():
    response = APIClient().post('/api/v1/leads/', payload(), format='json')

    assert response.status_code == 201
    assert response.data['status'] == 'received'
    assert response.data['message'] == 'Recebemos sua solicitação.'
    assert response.data['request_id']
    assert 'email' not in response.data
    assert 'whatsapp' not in response.data
    assert Lead.objects.count() == 1


@pytest.mark.django_db
def test_api_invalid_payload_does_not_persist():
    response = APIClient().post(
        '/api/v1/leads/',
        payload(email='invalid', privacy_policy_acknowledged=False),
        format='json',
    )

    assert response.status_code == 400
    assert response.data['error']['code'] == 'validation_error'
    assert 'email' in response.data['error']['fields']
    assert Lead.objects.count() == 0


def test_api_rejects_policy_version_without_persisting():
    response = APIClient().post(
        '/api/v1/leads/',
        payload(privacy_policy_version='pre-launch-old'),
        format='json',
    )

    assert response.status_code == 400
    assert response.data['error']['code'] == 'privacy_policy_version_mismatch'
    assert response.data['request_id']


def test_public_api_rejects_manual_source():
    response = APIClient().post('/api/v1/leads/', payload(source='manual'), format='json')

    assert response.status_code == 400
    assert response.data['error']['code'] == 'validation_error'
    assert 'source' in response.data['error']['fields']


def test_api_does_not_expose_public_read_endpoints():
    client = APIClient()

    assert client.get('/api/v1/leads/').status_code == 405
    assert client.get('/api/v1/leads/00000000-0000-0000-0000-000000000000/').status_code == 404


@pytest.mark.django_db
def test_admin_registers_lead_with_search_filters_and_archive_action():
    model_admin = admin.site._registry[Lead]

    assert isinstance(model_admin, LeadAdmin)
    assert model_admin.list_filter == ('status', 'project_type', 'created_at')
    assert model_admin.search_fields == ('name', 'email', 'whatsapp', 'business_name')
    assert model_admin.has_add_permission(None) is True
    assert model_admin.has_delete_permission(None) is False
    serializer = LeadSerializer(data=payload())
    assert serializer.is_valid(), serializer.errors
    lead = serializer.save()
    Lead.objects.filter(pk=lead.pk).update(updated_at=timezone.now() - timedelta(days=1))
    lead.refresh_from_db()
    original_updated_at = lead.updated_at

    model_admin.actions[0](model_admin, None, Lead.objects.filter(pk=lead.pk))

    lead.refresh_from_db()
    assert lead.status == Lead.Status.ARCHIVED
    assert lead.updated_at > original_updated_at
    assert set(model_admin.get_readonly_fields(None, lead)) >= {
        'name',
        'email',
        'whatsapp',
        'project_type',
        'business_name',
        'message',
    }


@pytest.mark.django_db
def test_admin_creates_manual_lead_with_internal_values_and_shared_normalization():
    user = get_user_model().objects.create_superuser(
        username='lead-admin',
        email='admin@example.test',
        password='Fictitious-Admin-Password-123!',
    )
    client = Client()
    client.force_login(user)

    response = client.post(
        reverse('admin:leads_lead_add'),
        {
            'name': '  Manual Fictício  ',
            'email': ' MANUAL@EXEMPLO.COM ',
            'whatsapp': '(11) 99999-9999',
            'project_type': 'landing_page',
            'business_name': '  Negócio manual  ',
            'message': '  Registro interno  ',
        },
    )

    assert response.status_code == 302
    lead = Lead.objects.get(email='manual@exemplo.com')
    assert lead.source == Lead.Source.MANUAL
    assert lead.status == Lead.Status.NEW
    assert lead.privacy_policy_acknowledged is False
    assert lead.privacy_policy_version == ''
    assert lead.whatsapp == '+5511999999999'
    assert lead.business_name == 'Negócio manual'


def test_admin_requires_authentication():
    response = APIClient().get('/admin/apps/leads/lead/')

    assert response.status_code == 302
    assert '/admin/login/' in response['Location']
