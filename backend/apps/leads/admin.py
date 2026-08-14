from django.contrib import admin

from .models import Lead


@admin.action(description='Arquivar Leads selecionados')
def archive_leads(modeladmin, request, queryset):
    queryset.update(status=Lead.Status.ARCHIVED)


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'project_type', 'status', 'created_at')
    list_filter = ('status', 'project_type', 'created_at')
    search_fields = ('name', 'email', 'whatsapp', 'business_name')
    readonly_fields = (
        'id',
        'name',
        'email',
        'whatsapp',
        'project_type',
        'business_name',
        'message',
        'source',
        'privacy_policy_acknowledged',
        'privacy_policy_version',
        'created_at',
        'updated_at',
    )
    actions = (archive_leads,)

    def has_delete_permission(self, request, obj=None):
        return False
