from dataclasses import dataclass
from datetime import timedelta

from django.db import connection, transaction
from django.utils import timezone

from .models import RateLimitCounter
from .security import protected_cache_key


class ProtectionUnavailable(Exception):
    pass


@dataclass(frozen=True)
class RateLimitExceeded(Exception):
    retry_after: int


def increment_counter(*, value: str, purpose: str, limit: int, timeout: int) -> None:
    key = protected_cache_key(value, purpose=purpose)
    try:
        expires_at = timezone.now() + timedelta(seconds=timeout)
        if connection.vendor == 'postgresql':
            table = connection.ops.quote_name(RateLimitCounter._meta.db_table)
            with connection.cursor() as cursor:
                cursor.execute(
                    f'''
                    INSERT INTO {table} ("key", "count", "expires_at")
                    VALUES (%s, 1, %s)
                    ON CONFLICT ("key") DO UPDATE
                    SET "count" = CASE
                            WHEN {table}."expires_at" <= CURRENT_TIMESTAMP THEN 1
                            ELSE {table}."count" + 1
                        END,
                        "expires_at" = CASE
                            WHEN {table}."expires_at" <= CURRENT_TIMESTAMP THEN EXCLUDED."expires_at"
                            ELSE {table}."expires_at"
                        END
                    RETURNING "count"
                    ''',
                    [key, expires_at],
                )
                count = cursor.fetchone()[0]
        else:
            with transaction.atomic():
                counter, created = RateLimitCounter.objects.select_for_update().get_or_create(
                    key=key,
                    defaults={'count': 1, 'expires_at': expires_at},
                )
                if created or counter.expires_at <= timezone.now():
                    count = 1
                    counter.count = count
                    counter.expires_at = expires_at
                else:
                    counter.count += 1
                    count = counter.count
                counter.save(update_fields=('count', 'expires_at'))
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
    key = protected_cache_key('readiness', purpose='readiness')
    try:
        expires_at = timezone.now() + timedelta(seconds=10)
        if connection.vendor == 'postgresql':
            table = connection.ops.quote_name(RateLimitCounter._meta.db_table)
            with connection.cursor() as cursor:
                cursor.execute(
                    f'''
                    INSERT INTO {table} ("key", "count", "expires_at")
                    VALUES (%s, 1, %s)
                    ON CONFLICT ("key") DO UPDATE
                    SET "count" = 1, "expires_at" = EXCLUDED."expires_at"
                    ''',
                    [key, expires_at],
                )
        else:
            RateLimitCounter.objects.update_or_create(
                key=key,
                defaults={'count': 1, 'expires_at': expires_at},
            )
    except Exception as exc:
        raise ProtectionUnavailable from exc
