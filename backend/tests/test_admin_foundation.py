import pytest
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.test import Client
from django.urls import reverse

from apps.core.admin_site import RepageAdminSite
from apps.leads.models import Lead


def test_repage_admin_site_keeps_native_admin_identity():
    assert isinstance(admin.site, RepageAdminSite)
    assert admin.site.name == 'admin'
    assert admin.site.site_header == 'Repage'
    assert admin.site.site_title == 'Repage Admin'
    assert admin.site.index_title == 'Administração'
    assert Lead in admin.site._registry
    assert get_user_model() in admin.site._registry


def test_admin_url_uses_repage_site_and_requires_authentication():
    response = Client().get(reverse('admin:index'))

    assert response.status_code == 302
    assert '/admin/login/' in response['Location']


def test_admin_login_uses_repage_templates():
    login_response = Client().get(reverse('admin:login'))
    assert login_response.status_code == 200
    content = login_response.content.decode()
    assert 'Entrar na administração' in content
    assert 'repage-admin/brand/logo.svg' in content
    assert content.count('repage-admin/admin.css') == 1
    assert content.index('admin/css/login.css') < content.index('repage-admin/admin.css')
    assert 'repage-admin/brand/favicon.svg' not in content


@pytest.mark.django_db
def test_authenticated_admin_root_redirects_to_leads_changelist():
    user = get_user_model().objects.create_superuser(
        username='repage-admin',
        email='admin@example.test',
        password='Fictitious-Admin-Password-123!',
    )
    client = Client()
    client.force_login(user)
    index_response = client.get(reverse('admin:index'))

    assert index_response.status_code == 302
    assert index_response.url == reverse('admin:leads_lead_changelist')
