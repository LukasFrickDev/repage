import re

from django import forms
from django.contrib import admin
from django.utils import timezone

from apps.core.admin import repage_admin_site

from .models import Lead
from .serializers import (
    normalize_business_name,
    normalize_email,
    normalize_message,
    normalize_name,
    normalize_whatsapp,
)


MANUAL_FIELDS = (
    'name',
    'email',
    'whatsapp',
    'project_type',
    'business_name',
    'message',
    'acquisition_source',
    'status',
)
READONLY_FIELDS = (
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
)
CREATION_READONLY_FIELDS = (
    'id',
    'source',
    'status',
    'privacy_policy_acknowledged',
    'privacy_policy_version',
    'created_at',
    'updated_at',
)


class LeadAdminForm(forms.ModelForm):
    whatsapp = forms.CharField(max_length=32)
    acquisition_source = forms.CharField(
        max_length=160,
        required=False,
        label='Origem do contato',
    )

    class Meta:
        model = Lead
        fields = MANUAL_FIELDS

    def clean_name(self):
        value = normalize_name(self.cleaned_data['name'])
        if not value:
            raise forms.ValidationError('Informe seu nome.')
        return value

    def clean_email(self):
        return normalize_email(self.cleaned_data['email'])

    def clean_whatsapp(self):
        try:
            return normalize_whatsapp(self.cleaned_data['whatsapp'])
        except ValueError as exc:
            raise forms.ValidationError(str(exc)) from exc

    def clean_business_name(self):
        return normalize_business_name(self.cleaned_data['business_name'])

    def clean_message(self):
        return normalize_message(self.cleaned_data['message'])

    def clean_acquisition_source(self):
        return self.cleaned_data['acquisition_source'].strip()


@admin.action(description='Arquivar Leads selecionados')
def archive_leads(modeladmin, request, queryset):
    queryset.update(status=Lead.Status.ARCHIVED, updated_at=timezone.now())


def format_whatsapp(value):
    digits = re.sub(r'\D', '', value or '')
    if digits.startswith('55') and len(digits) in (12, 13):
        digits = digits[2:]
    if len(digits) == 10:
        return f'({digits[:2]}) {digits[2:6]}-{digits[6:]}'
    if len(digits) == 11:
        return f'({digits[:2]}) {digits[2:7]}-{digits[7:]}'
    return value


class LeadAdmin(admin.ModelAdmin):
    form = LeadAdminForm
    list_display = ('name', 'email', 'whatsapp_display', 'project_type', 'status', 'created_at')
    list_filter = ('status', 'project_type', 'created_at')
    search_fields = ('name', 'email', 'whatsapp', 'business_name', 'acquisition_source')
    actions = (archive_leads,)

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return CREATION_READONLY_FIELDS
        return READONLY_FIELDS

    @admin.display(description='Telefone', ordering='whatsapp')
    def whatsapp_display(self, obj):
        return format_whatsapp(obj.whatsapp)

    def save_model(self, request, obj, form, change):
        if not change:
            obj.source = Lead.Source.MANUAL
            obj.status = Lead.Status.NEW
            obj.privacy_policy_acknowledged = False
            obj.privacy_policy_version = ''
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return False


repage_admin_site.register(Lead, LeadAdmin)
