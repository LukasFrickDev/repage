from django.urls import path

from .views import health, readiness


urlpatterns = [
    path('health/', health, name='health'),
    path('health/ready/', readiness, name='readiness'),
]
