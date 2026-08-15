from django.contrib import admin
from django.contrib.admin.apps import AdminConfig
from django.shortcuts import redirect


class RepageAdminSite(admin.AdminSite):
    site_header = 'Repage'
    site_title = 'Repage Admin'
    index_title = 'Administração'
    login_template = 'admin/login.html'

    def index(self, request, extra_context=None):
        return redirect('admin:leads_lead_changelist')


class RepageAdminConfig(AdminConfig):
    default_site = 'apps.core.admin_site.RepageAdminSite'
