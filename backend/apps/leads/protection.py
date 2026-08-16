from dataclasses import dataclass

from django.core.cache import caches

from .security import protected_cache_key


class ProtectionUnavailable(Exception):
    pass


@dataclass(frozen=True)
class RateLimitExceeded(Exception):
    retry_after: int


def _cache():
    return caches['lead_protection']


def increment_counter(*, value: str, purpose: str, limit: int, timeout: int) -> None:
    key = protected_cache_key(value, purpose=purpose)
    try:
        cache = _cache()
        if cache.add(key, 1, timeout=timeout):
            return
        count = cache.incr(key)
    except Exception as exc:
        raise ProtectionUnavailable from exc
    if count > limit:
        raise RateLimitExceeded(timeout)


def apply_ip_rate_limits(*, ip: str, settings) -> None:
    limits = (
        (ip, 'ip-short', settings.LEAD_RATE_LIMIT_IP_SHORT_COUNT, settings.LEAD_RATE_LIMIT_IP_SHORT_WINDOW_SECONDS),
        (ip, 'ip-daily', settings.LEAD_RATE_LIMIT_IP_DAILY_COUNT, settings.LEAD_RATE_LIMIT_IP_DAILY_WINDOW_SECONDS),
    )
    for value, purpose, limit, timeout in limits:
        increment_counter(value=value, purpose=purpose, limit=limit, timeout=timeout)


def apply_contact_rate_limits(*, email: str, whatsapp: str, settings) -> None:
    limits = (
        (email, 'email', settings.LEAD_RATE_LIMIT_EMAIL_COUNT, settings.LEAD_RATE_LIMIT_EMAIL_WINDOW_SECONDS),
        (whatsapp, 'whatsapp', settings.LEAD_RATE_LIMIT_PHONE_COUNT, settings.LEAD_RATE_LIMIT_PHONE_WINDOW_SECONDS),
    )
    for value, purpose, limit, timeout in limits:
        increment_counter(value=value, purpose=purpose, limit=limit, timeout=timeout)


def check_cache() -> None:
    key = 'repage:lead-protection:readiness'
    try:
        cache = _cache()
        cache.set(key, 'ok', timeout=10)
        if cache.get(key) != 'ok':
            raise ProtectionUnavailable
        cache.delete(key)
    except ProtectionUnavailable:
        raise
    except Exception as exc:
        raise ProtectionUnavailable from exc
