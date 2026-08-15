from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from apps.leads.protection import ProtectionUnavailable, check_cache


@require_GET
def health(request):
    return JsonResponse({'status': 'ok'})


@require_GET
def readiness(request):
    try:
        connection.ensure_connection()
        check_cache()
    except (DatabaseError, ProtectionUnavailable):
        return JsonResponse({'status': 'unavailable'}, status=503)
    return JsonResponse({'status': 'ready'})
