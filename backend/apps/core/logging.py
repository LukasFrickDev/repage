import contextvars
import json
import logging
from datetime import datetime, timezone


request_id_context = contextvars.ContextVar('request_id', default=None)

ALLOWED_FIELDS = (
    'request_id',
    'method',
    'path',
    'status_code',
    'duration_ms',
    'lead_id',
    'delivery_id',
    'kind',
    'attempts',
    'error_code',
)


class StructuredFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload = {
            'timestamp': datetime.fromtimestamp(
                record.created,
                tz=timezone.utc,
            ).isoformat(timespec='milliseconds').replace('+00:00', 'Z'),
            'level': record.levelname,
            'logger': record.name,
            'event': record.getMessage(),
        }
        request_id = getattr(record, 'request_id', None) or request_id_context.get()
        if request_id is not None:
            payload['request_id'] = str(request_id)
        for field in ALLOWED_FIELDS:
            if field == 'request_id':
                continue
            value = getattr(record, field, None)
            if value is not None:
                payload[field] = value
        return json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
