import logging
import time
import uuid

from django.http import HttpRequest, HttpResponse

from .logging import request_id_context


logger = logging.getLogger(__name__)


class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request.request_id = str(uuid.uuid4())
        context_token = request_id_context.set(request.request_id)
        started_at = time.perf_counter()
        try:
            response = self.get_response(request)
            response['X-Request-ID'] = request.request_id
            level = logging.ERROR if response.status_code >= 500 else logging.INFO
            logger.log(
                level,
                'request_completed',
                extra={
                    'request_id': request.request_id,
                    'method': request.method,
                    'path': request.path,
                    'status_code': response.status_code,
                    'duration_ms': round((time.perf_counter() - started_at) * 1000, 2),
                },
            )
            return response
        except Exception:
            logger.error(
                'request_completed',
                extra={
                    'request_id': request.request_id,
                    'method': request.method,
                    'path': request.path,
                    'status_code': 500,
                    'duration_ms': round((time.perf_counter() - started_at) * 1000, 2),
                    'error_code': 'internal_error',
                },
            )
            raise
        finally:
            request_id_context.reset(context_token)
