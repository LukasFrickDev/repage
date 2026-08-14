from django import forms
from django.contrib import admin
from django.utils import timezone

from .models import Lead
from .serializers import (
    normalize_business_name,
    normalize_email,
    normalize_message,
    normalize_name,
    normalize_whatsapp,
)


COMMERCIAL_FIELDS = (
    'name',
    'email',
    'whatsapp',
    'project_type',
    'business_name',
    'message',
)
TECHNICAL_FIELDS = (
    'id',
    'source',
    'status',
    'privacy_policy_acknowledged',
    'privacy_policy_version',
    'created_at',
    'updated_at',
)


class LeadAdminForm(forms.ModelForm):
    class Meta:
        model = Lead
        fields = COMMERCIAL_FIELDS

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


@admin.action(description='Arquivar Leads selecionados')
def archive_leads(modeladmin, request, queryset):
    queryset.update(status=Lead.Status.ARCHIVED, updated_at=timezone.now())


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    form = LeadAdminForm
    list_display = ('name', 'email', 'project_type', 'status', 'created_at')
    list_filter = ('status', 'project_type', 'created_at')
    search_fields = ('name', 'email', 'whatsapp', 'business_name')
    actions = (archive_leads,)

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return TECHNICAL_FIELDS
        return TECHNICAL_FIELDS + COMMERCIAL_FIELDS

    def save_model(self, request, obj, form, change):
        if not change:
            obj.source = Lead.Source.MANUAL
            obj.status = Lead.Status.NEW
            obj.privacy_policy_acknowledged = False
            obj.privacy_policy_version = ''
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return False
