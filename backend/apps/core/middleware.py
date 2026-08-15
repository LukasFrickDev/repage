import uuid

from django.http import HttpRequest, HttpResponse


class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request.request_id = uuid.uuid4()
        response = self.get_response(request)
        response['X-Request-ID'] = str(request.request_id)
        return response
