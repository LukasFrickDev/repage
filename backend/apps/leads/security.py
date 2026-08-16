import hashlib
import hmac
import json
from collections.abc import Mapping
from typing import Any

from django.conf import settings


def canonicalize(value: Mapping[str, Any]) -> bytes:
    """Serialize semantic values deterministically for a protected digest."""
    return json.dumps(
        value,
        ensure_ascii=False,
        separators=(',', ':'),
        sort_keys=True,
    ).encode('utf-8')


def protected_fingerprint(value: Mapping[str, Any], *, purpose: str) -> str:
    """Return a purpose-separated HMAC without exposing the canonical input."""
    if not purpose or not purpose.strip():
        raise ValueError('purpose must not be empty')
    message = purpose.strip().encode('utf-8') + b'\0' + canonicalize(value)
    return hmac.new(
        settings.SECRET_KEY.encode('utf-8'),
        message,
        hashlib.sha256,
    ).hexdigest()


def protected_cache_key(value: str, *, purpose: str) -> str:
    return f'repage:lead-protection:{purpose}:{protected_fingerprint({"value": value}, purpose=purpose)}'
