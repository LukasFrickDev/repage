import re

from django import forms
from django.contrib import admin
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils.html import format_html, format_html_join
from django.utils import timezone

from .email_service import process_manual_delivery
from .models import EmailDelivery, Lead
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
MANUAL_FIELDSET_FIELDS = (
    'name',
    'email',
    'whatsapp',
    'project_type',
    'business_name',
    'message',
    'acquisition_source',
)
STATUS_CLASSES = {
    Lead.Status.NEW: 'new',
    Lead.Status.IN_PROGRESS: 'in-progress',
    Lead.Status.DELIVERED: 'delivered',
    Lead.Status.MAINTENANCE: 'maintenance',
    Lead.Status.ARCHIVED: 'archived',
}
DELIVERY_READONLY_FIELDS = (
    'lead',
    'kind',
    'status',
    'attempts',
    'next_attempt_at',
    'last_attempt_at',
    'last_error_code',
    'sent_at',
    'created_at',
    'updated_at',
)


class EmailDeliveryInline(admin.TabularInline):
    model = EmailDelivery
    fields = (
        'kind',
        'status',
        'attempts',
        'next_attempt_at',
        'last_attempt_at',
        'last_error_code',
        'sent_at',
        'created_at',
    )
    readonly_fields = fields
    extra = 0
    max_num = 0

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


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


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    form = LeadAdminForm
    list_display = (
        'name',
        'email',
        'whatsapp_display',
        'project_type',
        'status_display',
        'created_at',
    )
    list_filter = ('status', 'project_type', 'source', 'created_at')
    search_fields = ('name', 'email', 'whatsapp', 'business_name', 'acquisition_source')
    actions = (archive_leads,)
    inlines = (EmailDeliveryInline,)

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return (
                (
                    'Novo Lead manual',
                    {
                        'fields': MANUAL_FIELDSET_FIELDS,
                        'description': (
                            'Leads manuais entram como Novo e usam origem técnica Manual.'
                        ),
                    },
                ),
            )
        return (
            (
                'Contato',
                {
                    'classes': ('repage-fieldset',),
                    'fields': ('name', 'email', 'whatsapp', 'business_name', 'contact_actions'),
                },
            ),
            (
                'Projeto',
                {
                    'classes': ('repage-fieldset',),
                    'fields': ('project_type', 'status', 'message'),
                },
            ),
            (
                'Origem',
                {
                    'classes': ('repage-fieldset',),
                    'fields': ('source', 'acquisition_source'),
                },
            ),
            (
                'Privacidade e registro',
                {
                    'classes': ('repage-fieldset',),
                    'fields': (
                        'privacy_policy_acknowledged',
                        'privacy_policy_version',
                        'id',
                        'created_at',
                        'updated_at',
                    ),
                },
            ),
        )

    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return CREATION_READONLY_FIELDS
        return (*READONLY_FIELDS, 'contact_actions')

    @admin.display(description='Telefone', ordering='whatsapp')
    def whatsapp_display(self, obj):
        return format_whatsapp(obj.whatsapp)

    @admin.display(description='Status', ordering='status')
    def status_display(self, obj):
        status_class = STATUS_CLASSES.get(obj.status, 'unknown')
        return format_html(
            '<span class="repage-status repage-status--{}">'
            '<span class="repage-status__dot" aria-hidden="true"></span>{}</span>',
            status_class,
            obj.get_status_display(),
        )

    @admin.display(description='Ações de contato')
    def contact_actions(self, obj):
        actions = []
        if obj.email:
            actions.append(
                format_html(
                    '<a class="repage-contact-action" href="mailto:{}">Enviar e-mail</a>',
                    obj.email,
                )
            )
        digits = re.sub(r'\D', '', obj.whatsapp or '')
        if digits:
            actions.append(
                format_html(
                    '<a class="repage-contact-action" href="https://wa.me/{}" '
                    'target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>',
                    digits,
                )
            )
        if not actions:
            return 'Nenhum contato disponível.'
        return format_html_join(' · ', '{}', ((action,) for action in actions))

    def save_model(self, request, obj, form, change):
        if not change:
            obj.source = Lead.Source.MANUAL
            obj.status = Lead.Status.NEW
            obj.privacy_policy_acknowledged = False
            obj.privacy_policy_version = ''
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(EmailDelivery)
class EmailDeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'lead_id',
        'kind',
        'status',
        'attempts',
        'next_attempt_at',
        'last_attempt_at',
        'last_error_code',
        'sent_at',
        'created_at',
        'updated_at',
        'resend_link',
    )
    list_filter = ('kind', 'status')
    search_fields = ('lead__id',)
    readonly_fields = DELIVERY_READONLY_FIELDS
    list_select_related = ('lead',)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def has_resend_permission(self, request):
        return request.user.has_perm('leads.change_emaildelivery')

    def get_urls(self):
        custom_urls = [
            path(
                '<path:object_id>/resend/',
                self.admin_site.admin_view(self.resend_view),
                name='leads_emaildelivery_resend',
            ),
        ]
        return custom_urls + super().get_urls()

    @admin.display(description='Reenvio')
    def resend_link(self, obj):
        if obj.status != EmailDelivery.Status.FAILED:
            return '—'
        url = reverse('admin:leads_emaildelivery_resend', args=[obj.pk])
        return format_html('<a href="{}">Reenviar</a>', url)

    def resend_view(self, request, object_id):
        if not self.has_resend_permission(request):
            raise PermissionDenied
        delivery = get_object_or_404(EmailDelivery.objects.select_related('lead'), pk=object_id)
        change_url = reverse('admin:leads_emaildelivery_change', args=[delivery.pk])
        if delivery.status != EmailDelivery.Status.FAILED:
            self.message_user(
                request,
                'Somente deliveries com falha podem ser reenviadas.',
                level=messages.WARNING,
            )
            return HttpResponseRedirect(change_url)
        if request.method == 'POST':
            result = process_manual_delivery(delivery.pk)
            if result is None:
                self.message_user(
                    request,
                    'A delivery deixou de estar disponível para reenvio.',
                    level=messages.WARNING,
                )
            elif result.status == EmailDelivery.Status.SENT:
                self.log_change(request, result, 'Tentativa manual de envio concluída com sucesso.')
                self.message_user(request, 'Delivery reenviada com sucesso.', level=messages.SUCCESS)
            else:
                self.log_change(request, result, 'Tentativa manual de envio falhou.')
                self.message_user(request, 'O reenvio falhou; a delivery permanece com falha.', level=messages.ERROR)
            return HttpResponseRedirect(change_url)
        context = {
            **self.admin_site.each_context(request),
            'title': 'Confirmar reenvio de delivery',
            'delivery': delivery,
            'opts': self.model._meta,
            'change_url': change_url,
        }
        return TemplateResponse(request, 'admin/leads/emaildelivery_resend_confirmation.html', context)
