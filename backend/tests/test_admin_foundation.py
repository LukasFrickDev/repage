from pathlib import Path

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
    assert admin.site.site_url == 'https://repage.com.br'
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
    assert '?v=' not in content
    assert content.index('admin/css/login.css') < content.index('repage-admin/admin.css')
    assert content.index('admin/css/responsive.css') < content.index('repage-admin/admin.css')
    assert content.index('repage-admin/theme.js') < content.index('admin/css/dark_mode.css')
    assert 'django.admin.navSidebarIsOpen' in content
    assert 'dataset.navSidebarState' in content
    assert 'repage-login-tools' in content
    assert 'matchMedia("(max-width: 767px)")' in content
    assert 'localStorage.setItem("django.admin.navSidebarIsOpen", "false")' in content
    assert content.index('dataset.navSidebarState') < content.index('admin/css/responsive.css')
    assert 'repage-admin/login.js' in content
    assert 'data-password-toggle' in content
    assert 'data-login-submit' in content
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

    changelist_response = client.get(reverse('admin:leads_lead_changelist'))
    assert changelist_response.context['site_url'] == 'https://repage.com.br'


@pytest.mark.django_db
def test_admin_preserves_sidebar_and_mobile_header_contracts():
    user = get_user_model().objects.create_superuser(
        username='repage-admin-readiness',
        email='admin-readiness@example.test',
        password='Fictitious-Admin-Readiness-123!',
    )
    client = Client()
    client.force_login(user)

    admin_css = (Path(__file__).parents[1] / 'static/repage-admin/admin.css').read_text()
    mobile_css = admin_css.split('@media (max-width: 767px)', 1)[1]

    assert '#header' in mobile_css
    assert 'flex-shrink: 0;' in mobile_css
    assert '#user-tools' in mobile_css
    assert '.repage-user-actions' in mobile_css
    assert 'display: flex;' in mobile_css
    assert 'flex: 0 0 auto;' in mobile_css
    assert 'flex-wrap: wrap;' in mobile_css
    assert 'height: auto;' in mobile_css
    assert 'min-height: 0;' in mobile_css
    assert '#logout-form' in mobile_css
    assert '.repage-theme-toggle' in mobile_css
    assert 'body.app-leads.model-lead.change-list' not in admin_css
    assert 'repageLeadChangelistReady' not in admin_css
    assert '#changelist .actions .delete-selected-action' in admin_css
    assert 'color: var(--button-fg);' in admin_css
    assert 'min-inline-size: 22ch;' in admin_css
    assert 'white-space: nowrap;' in admin_css
