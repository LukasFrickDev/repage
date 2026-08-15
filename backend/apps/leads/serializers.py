import re
from collections.abc import Mapping

from django.conf import settings
from rest_framework import serializers

from .models import Lead


def normalize_name(value):
    return value.strip()


def normalize_email(value):
    return value.strip().casefold()


def normalize_whatsapp(value):
    digits = re.sub(r'\D', '', value)
    if digits.startswith('55') and len(digits) in (12, 13):
        national_number = digits[2:]
    elif len(digits) in (10, 11):
        national_number = digits
    else:
        raise ValueError('Informe um WhatsApp brasileiro válido.')

    if national_number[0] == '0':
        raise ValueError('Informe um WhatsApp brasileiro válido.')
    if len(national_number) == 10 and national_number[2] not in '2345':
        raise ValueError('Informe um WhatsApp brasileiro válido.')
    if len(national_number) == 11 and national_number[2] != '9':
        raise ValueError('Informe um WhatsApp brasileiro válido.')
    return f'+55{national_number}'


def normalize_business_name(value):
    return value.strip()


def normalize_message(value):
    return value.replace('\r\n', '\n').replace('\r', '\n').strip()


class LeadSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=120,
        error_messages={
            'required': 'Informe seu nome.',
            'blank': 'Informe seu nome.',
            'max_length': 'O nome deve ter no máximo 120 caracteres.',
        },
    )
    email = serializers.EmailField(
        max_length=254,
        error_messages={
            'required': 'Informe seu e-mail.',
            'blank': 'Informe seu e-mail.',
            'invalid': 'Informe um e-mail válido.',
            'max_length': 'O e-mail deve ter no máximo 254 caracteres.',
        },
    )
    whatsapp = serializers.CharField(
        max_length=32,
        error_messages={
            'required': 'Informe seu WhatsApp.',
            'blank': 'Informe seu WhatsApp.',
            'max_length': 'O WhatsApp informado é muito longo.',
        },
    )
    project_type = serializers.ChoiceField(
        choices=Lead.ProjectType.choices,
        error_messages={
            'required': 'Selecione um tipo de projeto.',
            'invalid_choice': 'Selecione um tipo de projeto válido.',
        },
    )
    business_name = serializers.CharField(
        max_length=160,
        required=False,
        allow_blank=True,
        error_messages={'max_length': 'O nome deve ter no máximo 160 caracteres.'},
    )
    message = serializers.CharField(
        max_length=4000,
        required=False,
        allow_blank=True,
        error_messages={'max_length': 'A mensagem deve ter no máximo 4000 caracteres.'},
    )
    source = serializers.ChoiceField(
        choices=((Lead.Source.WEBSITE, Lead.Source.WEBSITE.label),),
        error_messages={
            'required': 'A origem da solicitação é obrigatória.',
            'invalid_choice': 'A origem da solicitação é inválida.',
        },
    )
    privacy_policy_acknowledged = serializers.BooleanField(
        error_messages={'required': 'É necessário declarar ciência da Política de Privacidade.'},
    )
    privacy_policy_version = serializers.CharField(
        max_length=64,
        error_messages={
            'required': 'A versão da Política de Privacidade é obrigatória.',
            'blank': 'A versão da Política de Privacidade é obrigatória.',
            'max_length': 'A versão da Política de Privacidade é inválida.',
        },
    )

    class Meta:
        model = Lead
        fields = (
            'name',
            'email',
            'whatsapp',
            'project_type',
            'business_name',
            'message',
            'privacy_policy_acknowledged',
            'privacy_policy_version',
            'source',
        )

    def to_internal_value(self, data):
        if isinstance(data, Mapping):
            unknown_fields = sorted(set(data) - set(self.fields))
            if unknown_fields:
                raise serializers.ValidationError({
                    field: ['Este campo não é permitido.'] for field in unknown_fields
                })
        return super().to_internal_value(data)

    def validate_name(self, value):
        value = normalize_name(value)
        if not value:
            raise serializers.ValidationError('Informe seu nome.')
        return value

    def validate_email(self, value):
        return normalize_email(value)

    def validate_whatsapp(self, value):
        try:
            return normalize_whatsapp(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc

    def validate_business_name(self, value):
        return normalize_business_name(value)

    def validate_message(self, value):
        return normalize_message(value)

    def validate_privacy_policy_acknowledged(self, value):
        if not value:
            raise serializers.ValidationError(
                'É necessário declarar ciência da Política de Privacidade.'
            )
        return value

    def validate(self, attrs):
        if attrs['privacy_policy_version'] != settings.PRIVACY_POLICY_VERSION:
            raise serializers.ValidationError({
                'privacy_policy_version': serializers.ErrorDetail(
                    'Atualize a página para aceitar a versão vigente da Política de Privacidade.',
                    code='privacy_policy_version_mismatch',
                )
            })
        return attrs
