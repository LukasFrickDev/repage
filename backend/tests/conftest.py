import pytest
from django.core.cache import caches


@pytest.fixture(autouse=True)
def isolated_lead_protection_cache(settings):
    settings.CACHES = {
        **settings.CACHES,
        'lead_protection': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'repage-test-lead-protection',
        },
    }
    caches.close_all()
    yield
    caches['lead_protection'].clear()
    caches.close_all()
