import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta

import pytest
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.conf import settings
from django.core.cache import caches
from django.db import IntegrityError
from django.core.management import call_command
from django.test import Client
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient

from apps.leads.admin import LeadAdmin, LeadAdminForm
from apps.leads.models import EmailDelivery, IdempotencyRecord, Lead
from apps.leads.serializers import LeadSerializer
from apps.leads.security import canonicalize, protected_cache_key, protected_fingerprint


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
        'form_started_at': (timezone.now() - timedelta(seconds=10)).isoformat(),
    }
    value.update(overrides)
    return value


def api_headers(key='00000000-0000-4000-8000-000000000001'):
    return {'HTTP_IDEMPOTENCY_KEY': key}


def clear_protection_cache():
    caches['lead_protection'].clear()


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


@pytest.mark.django_db
def test_email_delivery_has_safe_defaults_and_supported_values():
    lead = Lead.objects.create(
        name='Ana Souza', email='ana@example.com', whatsapp='+5511999999999',
        project_type=Lead.ProjectType.INSTITUTIONAL_SITE, source=Lead.Source.WEBSITE,
    )
    delivery = EmailDelivery.objects.create(
        lead=lead, kind=EmailDelivery.Kind.INTERNAL_NOTIFICATION,
    )

    assert delivery.status == EmailDelivery.Status.PENDING
    assert delivery.attempts == 0
    assert delivery.next_attempt_at is not None
    assert delivery.last_attempt_at is None
    assert delivery.sent_at is None
    assert delivery.last_error_code == ''
    assert set(EmailDelivery.Kind.values) == {'internal_notification', 'visitor_confirmation'}
    assert set(EmailDelivery.Status.values) == {'pending', 'sent', 'failed'}


@pytest.mark.django_db
def test_email_delivery_kind_is_unique_per_lead():
    lead = Lead.objects.create(
        name='Ana Souza', email='ana@example.com', whatsapp='+5511999999999',
        project_type=Lead.ProjectType.INSTITUTIONAL_SITE, source=Lead.Source.WEBSITE,
    )
    EmailDelivery.objects.create(lead=lead, kind=EmailDelivery.Kind.VISITOR_CONFIRMATION)

    with pytest.raises(IntegrityError):
        EmailDelivery.objects.create(lead=lead, kind=EmailDelivery.Kind.VISITOR_CONFIRMATION)


@pytest.mark.django_db
def test_idempotency_record_stores_only_safe_response_shape():
    lead = Lead.objects.create(
        name='Ana Souza', email='ana@example.com', whatsapp='+5511999999999',
        project_type=Lead.ProjectType.INSTITUTIONAL_SITE, source=Lead.Source.WEBSITE,
    )
    record = IdempotencyRecord.objects.create(
        key=uuid.uuid4(), fingerprint='a' * 64, lead=lead, response_status=201,
        response_payload={'status': 'received', 'message': 'Recebemos sua solicitação.'},
        expires_at=timezone.now() + timedelta(hours=24),
    )

    assert record.response_payload == {
        'status': 'received', 'message': 'Recebemos sua solicitação.',
    }


@pytest.mark.django_db
def test_idempotency_key_is_unique():
    lead = Lead.objects.create(
        name='Ana Souza', email='ana@example.com', whatsapp='+5511999999999',
        project_type=Lead.ProjectType.INSTITUTIONAL_SITE, source=Lead.Source.WEBSITE,
    )
    key = uuid.uuid4()
    values = {
        'key': key, 'fingerprint': 'a' * 64, 'lead': lead, 'response_status': 201,
        'response_payload': {'status': 'received'},
        'expires_at': timezone.now() + timedelta(hours=24),
    }
    IdempotencyRecord.objects.create(**values)

    with pytest.raises(IntegrityError):
        IdempotencyRecord.objects.create(**values)


def test_protected_fingerprint_is_deterministic_and_purpose_separated():
    values = {'email': 'ana@example.com', 'name': 'Ana Souza'}

    assert protected_fingerprint(values, purpose='lead-fingerprint') == protected_fingerprint(
        {'name': 'Ana Souza', 'email': 'ana@example.com'}, purpose='lead-fingerprint',
    )
    assert protected_fingerprint(values, purpose='lead-fingerprint') != protected_fingerprint(
        values, purpose='cache-email',
    )
    assert 'ana@example.com' not in protected_fingerprint(values, purpose='lead-fingerprint')
    assert canonicalize({'b': 2, 'a': 1}) == b'{"a":1,"b":2}'


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
    response = APIClient().post('/api/v1/leads/', payload(), format='json', **api_headers())

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
    assert EmailDelivery.objects.filter(lead=lead).count() == 2


def test_api_requires_a_valid_idempotency_key():
    missing = APIClient().post('/api/v1/leads/', payload(), format='json')
    invalid = APIClient().post(
        '/api/v1/leads/', payload(), format='json', HTTP_IDEMPOTENCY_KEY='not-a-uuid'
    )

    assert missing.status_code == 400
    assert missing.data['error']['code'] == 'idempotency_key_required'
    assert invalid.status_code == 400
    assert invalid.data['error']['code'] == 'idempotency_key_invalid'


def test_api_rejects_honeypot_and_fast_submission_without_persisting():
    honeypot = APIClient().post(
        '/api/v1/leads/', payload(company_website='filled'), format='json', **api_headers()
    )
    fast = APIClient().post(
        '/api/v1/leads/',
        payload(form_started_at=timezone.now().isoformat()),
        format='json',
        **api_headers('00000000-0000-4000-8000-000000000002'),
    )

    assert honeypot.status_code == 400
    assert honeypot.data['error']['code'] == 'invalid_submission'
    assert fast.status_code == 429
    assert fast.data['error']['code'] == 'submission_too_fast'


@pytest.mark.django_db
def test_api_replays_same_key_with_a_new_request_id_without_new_records():
    clear_protection_cache()
    client = APIClient()
    first = client.post('/api/v1/leads/', payload(), format='json', **api_headers('00000000-0000-4000-8000-000000000003'))
    replay = client.post('/api/v1/leads/', payload(), format='json', **api_headers('00000000-0000-4000-8000-000000000003'))

    assert first.status_code == replay.status_code == 201
    assert first.data['request_id'] != replay.data['request_id']
    assert Lead.objects.count() == 1
    assert EmailDelivery.objects.count() == 2
    assert IdempotencyRecord.objects.count() == 1


@pytest.mark.django_db
def test_api_rejects_same_key_with_a_different_fingerprint():
    clear_protection_cache()
    client = APIClient()
    key = '00000000-0000-4000-8000-000000000004'
    first = client.post('/api/v1/leads/', payload(), format='json', **api_headers(key))
    conflict = client.post(
        '/api/v1/leads/', payload(message='Outra mensagem'), format='json', **api_headers(key)
    )

    assert first.status_code == 201
    assert conflict.status_code == 409
    assert conflict.data['error']['code'] == 'idempotency_conflict'
    assert Lead.objects.count() == 1
    assert EmailDelivery.objects.count() == 2
    assert IdempotencyRecord.objects.count() == 1


@pytest.mark.django_db
def test_expired_key_can_be_reused_after_duplicate_window():
    clear_protection_cache()
    client = APIClient()
    key = '00000000-0000-4000-8000-000000000005'
    first = client.post('/api/v1/leads/', payload(), format='json', **api_headers(key))
    lead = Lead.objects.get()
    Lead.objects.filter(pk=lead.pk).update(
        created_at=timezone.now() - timedelta(seconds=settings.LEAD_DUPLICATE_WINDOW_SECONDS + 1)
    )
    IdempotencyRecord.objects.filter(key=key).update(expires_at=timezone.now() - timedelta(seconds=1))
    second = client.post('/api/v1/leads/', payload(), format='json', **api_headers(key))

    assert first.status_code == second.status_code == 201
    assert Lead.objects.count() == 2
    assert EmailDelivery.objects.count() == 4
    assert IdempotencyRecord.objects.count() == 1


@pytest.mark.django_db
def test_duplicate_window_reuses_lead_without_new_deliveries():
    clear_protection_cache()
    client = APIClient()
    first = client.post('/api/v1/leads/', payload(), format='json', **api_headers('00000000-0000-4000-8000-000000000006'))
    second = client.post('/api/v1/leads/', payload(), format='json', **api_headers('00000000-0000-4000-8000-000000000007'))

    assert first.status_code == second.status_code == 201
    assert Lead.objects.count() == 1
    assert EmailDelivery.objects.count() == 2
    assert IdempotencyRecord.objects.count() == 2


@pytest.mark.django_db
def test_api_rejects_future_timestamp_without_persistence():
    response = APIClient().post(
        '/api/v1/leads/',
        payload(form_started_at=(timezone.now() + timedelta(minutes=1)).isoformat()),
        format='json',
        **api_headers('00000000-0000-4000-8000-000000000008'),
    )

    assert response.status_code == 429
    assert response.data['error']['code'] == 'submission_too_fast'
    assert response['Retry-After']
    assert Lead.objects.count() == 0


def test_protection_cache_keys_do_not_contain_identifiers():
    sensitive = 'ana@example.com|+5511999999999|192.0.2.10'
    key = protected_cache_key(sensitive, purpose='email')

    assert sensitive not in key
    assert 'ana@example.com' not in key
    assert '+5511999999999' not in key
    assert '192.0.2.10' not in key


@pytest.mark.django_db
def test_ip_throttling_uses_remote_addr_instead_of_forwarded_header():
    clear_protection_cache()
    responses = []
    for index in range(6):
        responses.append(APIClient().post(
            '/api/v1/leads/',
            payload(
                email=f'ip-{index}@example.com',
                whatsapp=f'1199999{index:04d}',
            ),
            format='json',
            HTTP_REMOTE_ADDR='198.51.100.10',
            HTTP_X_FORWARDED_FOR=f'203.0.113.{index + 1}',
            **api_headers(f'00000000-0000-4000-8000-{index + 10:012d}'),
        ))

    assert [response.status_code for response in responses[:5]] == [201] * 5
    assert responses[5].status_code == 429
    assert responses[5].data['error']['code'] == 'rate_limited'


@pytest.mark.django_db(transaction=True)
def test_concurrent_same_key_creates_one_lead_and_two_deliveries():
    clear_protection_cache()
    key = '00000000-0000-4000-8000-000000000009'

    def submit():
        client = APIClient()
        return client.post('/api/v1/leads/', payload(), format='json', **api_headers(key))

    with ThreadPoolExecutor(max_workers=2) as executor:
        responses = list(executor.map(lambda _: submit(), range(2)))

    assert [response.status_code for response in responses] == [201, 201]
    assert Lead.objects.count() == 1
    assert EmailDelivery.objects.count() == 2
    assert IdempotencyRecord.objects.count() == 1


@pytest.mark.django_db
def test_cleanup_idempotency_removes_only_expired_records():
    lead = Lead.objects.create(
        name='Cleanup', email='cleanup@example.com', whatsapp='+5511999999999',
        project_type=Lead.ProjectType.LANDING_PAGE, source=Lead.Source.WEBSITE,
    )
    IdempotencyRecord.objects.create(
        key=uuid.uuid4(), fingerprint='a' * 64, lead=lead, response_status=201,
        response_payload={'status': 'received'}, expires_at=timezone.now() - timedelta(seconds=1),
    )
    active = IdempotencyRecord.objects.create(
        key=uuid.uuid4(), fingerprint='b' * 64, lead=lead, response_status=201,
        response_payload={'status': 'received'}, expires_at=timezone.now() + timedelta(hours=1),
    )

    call_command('cleanup_idempotency')

    assert IdempotencyRecord.objects.count() == 1
    assert IdempotencyRecord.objects.get(pk=active.pk).expires_at > timezone.now()


@pytest.mark.django_db
def test_api_invalid_payload_does_not_persist():
    response = APIClient().post(
        '/api/v1/leads/',
        payload(email='invalid', privacy_policy_acknowledged=False),
        format='json',
        **api_headers(),
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
        **api_headers(),
    )

    assert response.status_code == 400
    assert response.data['error']['code'] == 'privacy_policy_version_mismatch'
    assert response.data['request_id']


def test_public_api_rejects_manual_source():
    response = APIClient().post('/api/v1/leads/', payload(source='manual'), format='json', **api_headers())

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


def test_phase_one_models_are_not_registered_in_admin():
    assert EmailDelivery not in admin.site._registry
    assert IdempotencyRecord not in admin.site._registry


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
    assert not lead.email_deliveries.exists()

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
    assert not lead_without_acquisition.email_deliveries.exists()

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
