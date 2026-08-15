from django.urls import include, path

from apps.core.admin import repage_admin_site
from apps.leads import admin as leads_admin  # noqa: F401


urlpatterns = [
    path('admin/', repage_admin_site.urls),
    path('', include('apps.core.urls')),
    path('api/v1/', include('apps.leads.urls')),
]
