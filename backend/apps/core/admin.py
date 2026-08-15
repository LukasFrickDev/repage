from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User
from django.shortcuts import redirect


class RepageAdminSite(admin.AdminSite):
    site_header = 'Repage'
    site_title = 'Repage Admin'
    index_title = 'Administração'
    login_template = 'admin/login.html'

    def index(self, request, extra_context=None):
        return redirect('admin:leads_lead_changelist')


repage_admin_site = RepageAdminSite(name='admin')
repage_admin_site.register(User, UserAdmin)
repage_admin_site.register(Group, GroupAdmin)
