import logging
import time
import uuid

from django.conf import settings
from django.db import connection
from django.http import HttpRequest, HttpResponse

from .logging import request_id_context


logger = logging.getLogger(__name__)


class DatabaseQueryTimer:
    def __init__(self):
        self.count = 0
        self.duration_ms = 0.0

    def __call__(self, execute, sql, params, many, context):
        started_at = time.perf_counter()
        try:
            return execute(sql, params, many, context)
        finally:
            self.count += 1
            self.duration_ms += (time.perf_counter() - started_at) * 1000


class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request.request_id = str(uuid.uuid4())
        context_token = request_id_context.set(request.request_id)
        started_at = time.perf_counter()
        query_timer = DatabaseQueryTimer() if settings.DJANGO_DB_TIMING_ENABLED else None

        def request_extra(status_code, **extra):
            fields = {
                'request_id': request.request_id,
                'method': request.method,
                'path': request.path,
                'status_code': status_code,
                'duration_ms': round((time.perf_counter() - started_at) * 1000, 2),
                **extra,
            }
            if query_timer is not None:
                fields['db_query_count'] = query_timer.count
                fields['db_duration_ms'] = round(query_timer.duration_ms, 2)
            return fields

        try:
            if query_timer is None:
                response = self.get_response(request)
            else:
                with connection.execute_wrapper(query_timer):
                    response = self.get_response(request)
            response['X-Request-ID'] = request.request_id
            level = logging.ERROR if response.status_code >= 500 else logging.INFO
            logger.log(
                level,
                'request_completed',
                extra=request_extra(response.status_code),
            )
            return response
        except Exception:
            logger.error(
                'request_completed',
                extra=request_extra(500, error_code='internal_error'),
            )
            raise
        finally:
            request_id_context.reset(context_token)
