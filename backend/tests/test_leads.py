import uuid
from datetime import timedelta

import pytest
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.conf import settings
from django.test import Client
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient

from apps.leads.admin import LeadAdmin, LeadAdminForm
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
    assert lead.acquisition_source == ''
    assert set(Lead.ProjectType.values) == {
        'landing_page',
        'institutional_site',
        'custom_solution',
        'support_or_evolution',
        'not_sure',
    }
    assert set(Lead.Status.values) == {
        'new',
        'in_progress',
        'delivered',
        'maintenance',
        'archived',
    }
    assert dict(Lead.Status.choices) == {
        'new': 'Novo',
        'in_progress': 'Em andamento',
        'delivered': 'Entregue',
        'maintenance': 'Manutenção',
        'archived': 'Arquivado',
    }
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


def test_serializer_rejects_public_acquisition_source():
    serializer = LeadSerializer(data=payload(acquisition_source='Indicação'))

    assert not serializer.is_valid()
    assert serializer.errors['acquisition_source'] == ['Este campo não é permitido.']


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
@pytest.mark.parametrize(
    'status',
    [
        Lead.Status.NEW,
        Lead.Status.IN_PROGRESS,
        Lead.Status.DELIVERED,
        Lead.Status.MAINTENANCE,
        Lead.Status.ARCHIVED,
    ],
)
def test_lead_accepts_all_status_choices(status):
    lead = Lead.objects.create(
        name='Status Fictício',
        email='status@example.test',
        whatsapp='+5511999999999',
        project_type=Lead.ProjectType.LANDING_PAGE,
        source=Lead.Source.MANUAL,
        status=status,
    )

    assert Lead.objects.get(pk=lead.pk).status == status


def test_admin_status_form_rejects_invalid_choice():
    form = LeadAdminForm(
        data={
            'name': 'Status Fictício',
            'email': 'status@example.test',
            'whatsapp': '+55 11 99999-9999',
            'project_type': Lead.ProjectType.LANDING_PAGE,
            'business_name': '',
            'message': '',
            'status': 'not_a_status',
        }
    )

    assert not form.is_valid()
    assert 'status' in form.errors


def test_admin_form_rejects_excessive_acquisition_source():
    form = LeadAdminForm(
        data={
            'name': 'Origem Fictícia',
            'email': 'origem@example.test',
            'whatsapp': '+55 11 99999-9999',
            'project_type': Lead.ProjectType.LANDING_PAGE,
            'business_name': '',
            'message': '',
            'acquisition_source': 'x' * 161,
            'status': Lead.Status.NEW,
        }
    )

    assert not form.is_valid()
    assert 'acquisition_source' in form.errors


def test_admin_form_labels_acquisition_source_in_portuguese():
    assert LeadAdminForm().fields['acquisition_source'].label == 'Origem do contato'


@pytest.mark.django_db
def test_api_creates_lead_and_returns_safe_response():
    response = APIClient().post('/api/v1/leads/', payload(), format='json')

    assert response.status_code == 201
    assert response.data['status'] == 'received'
    assert response.data['message'] == 'Recebemos sua solicitação.'
    assert response.data['request_id']
    assert 'email' not in response.data
    assert 'whatsapp' not in response.data
    lead = Lead.objects.get()
    assert lead.source == Lead.Source.WEBSITE
    assert lead.acquisition_source == ''
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
    assert model_admin.list_display == (
        'name',
        'email',
        'whatsapp_display',
        'project_type',
        'status_display',
        'created_at',
    )
    assert model_admin.list_filter == ('status', 'project_type', 'source', 'created_at')
    assert model_admin.search_fields == (
        'name',
        'email',
        'whatsapp',
        'business_name',
        'acquisition_source',
    )
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
    assert set(model_admin.get_readonly_fields(None, lead)) == {
        'id',
        'name',
        'business_name',
        'message',
        'source',
        'acquisition_source',
        'privacy_policy_acknowledged',
        'privacy_policy_version',
        'created_at',
        'updated_at',
        'contact_actions',
    }
    assert {'email', 'whatsapp', 'project_type', 'status'}.isdisjoint(
        model_admin.get_readonly_fields(None, lead)
    )
    assert model_admin.form is LeadAdminForm
    assert model_admin.whatsapp_display(lead) == '(11) 99999-9999'


def test_admin_lead_fieldsets_preserve_operational_and_historical_boundaries():
    model_admin = admin.site._registry[Lead]
    add_fields = model_admin.get_fieldsets(None)[0][1]['fields']
    change_fieldsets = model_admin.get_fieldsets(None, Lead())[0:]
    change_fields = [field for _, options in change_fieldsets for field in options['fields']]

    assert add_fields == (
        'name',
        'email',
        'whatsapp',
        'project_type',
        'business_name',
        'message',
        'acquisition_source',
    )
    assert {'email', 'whatsapp', 'project_type', 'status'}.issubset(change_fields)
    assert {'id', 'source', 'acquisition_source', 'message'}.issubset(change_fields)
    assert {'email', 'whatsapp', 'project_type', 'status'}.isdisjoint(
        model_admin.get_readonly_fields(None, Lead())
    )


def test_admin_status_display_has_text_and_distinct_visual_classes():
    model_admin = admin.site._registry[Lead]
    rendered = {
        status: str(model_admin.status_display(Lead(status=status)))
        for status in Lead.Status.values
    }

    assert all(Lead(status=status).get_status_display() in html for status, html in rendered.items())
    assert all('repage-status__dot' in html for html in rendered.values())
    assert len({html.split('repage-status--', 1)[1].split('"', 1)[0] for html in rendered.values()}) == 5


def test_admin_contact_actions_use_explicit_safe_destinations():
    model_admin = admin.site._registry[Lead]
    html = str(
        model_admin.contact_actions(
            Lead(email='contato@example.test', whatsapp='+5511999999999')
        )
    )

    assert 'mailto:contato@example.test' in html
    assert 'https://wa.me/5511999999999' in html
    assert 'target="_blank"' in html
    assert 'noopener noreferrer' in html
    assert 'text=' not in html


@pytest.mark.django_db
def test_admin_edits_operational_fields_in_place_with_shared_normalization():
    user = get_user_model().objects.create_superuser(
        username='lead-change-admin',
        email='change-admin@example.test',
        password='Fictitious-Admin-Password-123!',
    )
    lead = Lead.objects.create(
        name='Lead Histórico',
        email='historico@example.com',
        whatsapp='+5511999999999',
        project_type=Lead.ProjectType.LANDING_PAGE,
        business_name='Negócio histórico',
        message='Mensagem integral fictícia',
        source=Lead.Source.WEBSITE,
        privacy_policy_acknowledged=True,
        privacy_policy_version=settings.PRIVACY_POLICY_VERSION,
    )
    original_id = lead.id

    client = Client()
    client.force_login(user)

    statuses = [
        Lead.Status.IN_PROGRESS,
        Lead.Status.DELIVERED,
        Lead.Status.MAINTENANCE,
        Lead.Status.ARCHIVED,
    ]
    for status in statuses:
        Lead.objects.filter(pk=lead.pk).update(updated_at=timezone.now() - timedelta(days=1))
        lead.refresh_from_db()
        original_updated_at = lead.updated_at
        response = client.post(
            reverse('admin:leads_lead_change', args=[lead.pk]),
            {
                'email': '  EDITADO@EXEMPLO.COM ',
                'whatsapp': '+55 11 95824-4081',
                'project_type': Lead.ProjectType.CUSTOM_SOLUTION,
                'status': status,
                '_save': 'Salvar e continuar editando',
            },
        )

        assert response.status_code == 302
        lead.refresh_from_db()
        assert lead.status == status
        assert lead.updated_at > original_updated_at

    assert lead.id == original_id
    assert Lead.objects.count() == 1
    assert lead.email == 'editado@exemplo.com'
    assert lead.whatsapp == '+5511958244081'
    assert lead.project_type == Lead.ProjectType.CUSTOM_SOLUTION
    assert lead.status == Lead.Status.ARCHIVED
    assert lead.name == 'Lead Histórico'
    assert lead.business_name == 'Negócio histórico'
    assert lead.message == 'Mensagem integral fictícia'
    assert [model.__name__ for model in Lead._meta.app_config.get_models()] == ['Lead']


@pytest.mark.django_db
def test_admin_creates_manual_lead_with_internal_values_and_shared_normalization():
    user = get_user_model().objects.create_user(
        username='lead-admin',
        email='admin@example.test',
        password='Fictitious-Admin-Password-123!',
        is_staff=True,
    )
    permissions = Permission.objects.filter(
        codename__in=('add_lead', 'view_lead'),
        content_type__app_label='leads',
    )
    user.user_permissions.add(*permissions)
    client = Client()
    client.force_login(user)

    response = client.post(
        reverse('admin:leads_lead_add'),
        {
            'name': '  Manual Fictício  ',
            'email': ' MANUAL@EXEMPLO.COM ',
            'whatsapp': '+55 11 99999-9999',
            'project_type': 'landing_page',
            'business_name': '  Negócio manual  ',
            'message': '  Registro interno  ',
            'acquisition_source': '  Indicação da Carol  ',
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
    assert lead.acquisition_source == 'Indicação da Carol'

    search_response = client.get(
        reverse('admin:leads_lead_changelist'),
        {'q': 'Indicação da Carol'},
    )
    assert search_response.status_code == 200
    assert 'Manual Fictício' in search_response.content.decode()

    response_without_acquisition = client.post(
        reverse('admin:leads_lead_add'),
        {
            'name': '  Manual Sem Origem  ',
            'email': 'manual-sem-origem@example.test',
            'whatsapp': '11999999999',
            'project_type': 'landing_page',
            'business_name': '',
            'message': '',
        },
    )
    assert response_without_acquisition.status_code == 302
    lead_without_acquisition = Lead.objects.get(email='manual-sem-origem@example.test')
    assert lead_without_acquisition.acquisition_source == ''
    assert lead_without_acquisition.source == Lead.Source.MANUAL

    detail_response = client.get(
        reverse('admin:leads_lead_change', args=[lead.pk]),
    )
    assert detail_response.status_code == 200
    assert 'Indicação da Carol' in detail_response.content.decode()
    assert 'name="acquisition_source"' not in detail_response.content.decode()


@pytest.mark.django_db
def test_admin_staff_without_add_permission_cannot_create_lead():
    user = get_user_model().objects.create_user(
        username='lead-read-only',
        password='Fictitious-Admin-Password-123!',
        is_staff=True,
    )
    client = Client()
    client.force_login(user)

    response = client.get(reverse('admin:leads_lead_add'))

    assert response.status_code == 403
    assert Lead.objects.count() == 0


def test_admin_requires_authentication():
    response = Client().get(reverse('admin:leads_lead_add'))

    assert response.status_code == 302
    assert '/admin/login/' in response['Location']
