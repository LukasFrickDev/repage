import logging

from django.db import DatabaseError
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LeadSerializer


logger = logging.getLogger(__name__)


def error_response(code, message, request_id, fields=None, http_status=status.HTTP_400_BAD_REQUEST):
    error = {'code': code, 'message': message}
    if fields:
        error['fields'] = fields
    return Response(
        {'error': error, 'request_id': str(request_id)},
        status=http_status,
    )


def contains_error_code(errors, code):
    if isinstance(errors, dict):
        return any(contains_error_code(value, code) for value in errors.values())
    if isinstance(errors, (list, tuple)):
        return any(contains_error_code(value, code) for value in errors)
    return getattr(errors, 'code', None) == code


class LeadCreateView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        request_id = request.request_id
        serializer = LeadSerializer(data=request.data)
        if not serializer.is_valid():
            error_code = (
                'privacy_policy_version_mismatch'
                if contains_error_code(serializer.errors, 'privacy_policy_version_mismatch')
                else 'validation_error'
            )
            return error_response(
                error_code,
                'Revise os campos informados.' if error_code == 'validation_error' else 'Atualize a página e tente novamente.',
                request_id,
                serializer.errors,
            )

        try:
            serializer.save()
        except DatabaseError:
            logger.error('lead_persistence_failed', extra={'request_id': str(request_id)})
            return error_response(
                'server_error',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception:
            logger.error('lead_creation_failed', extra={'request_id': str(request_id)})
            return error_response(
                'server_error',
                'Não foi possível processar sua solicitação agora.',
                request_id,
                http_status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                'status': 'received',
                'message': 'Recebemos sua solicitação.',
                'request_id': str(request_id),
            },
            status=status.HTTP_201_CREATED,
        )
