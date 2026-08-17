import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {'1', 'true', 'yes', 'on'}


def env_list(name: str, default: str = '') -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


def env_int(name: str, default: int, *, minimum: int = 0) -> int:
    value = os.getenv(name, str(default)).strip()
    try:
        parsed = int(value)
    except ValueError as exc:
        raise ImproperlyConfigured(f'{name} deve ser um inteiro.') from exc
    if parsed < minimum:
        raise ImproperlyConfigured(f'{name} deve ser maior ou igual a {minimum}.')
    return parsed


def required_env(name: str) -> str:
    value = os.getenv(name, '').strip()
    if not value:
        raise ImproperlyConfigured(f'{name} deve ser definido em produção.')
    return value


ENVIRONMENT = os.getenv('DJANGO_ENVIRONMENT', 'development').strip().lower()
configured_secret_key = os.getenv('DJANGO_SECRET_KEY', '').strip()
SECRET_KEY = configured_secret_key or 'dev-only-change-me'
DEBUG = env_bool('DJANGO_DEBUG', True)

if ENVIRONMENT == 'production':
    if not configured_secret_key or configured_secret_key == 'dev-only-change-me':
        raise ImproperlyConfigured('DJANGO_SECRET_KEY deve ser definido em produção.')
    if DEBUG:
        raise ImproperlyConfigured('DJANGO_DEBUG deve ser falso em produção.')
    ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS')
    if not ALLOWED_HOSTS:
        raise ImproperlyConfigured('DJANGO_ALLOWED_HOSTS deve ser definido em produção.')
else:
    ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')

INSTALLED_APPS = [
    'apps.core.admin_site.RepageAdminConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'apps.core',
    'apps.leads',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.core.middleware.RequestIDMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

if ENVIRONMENT == 'production':
    postgres_config = {
        'NAME': required_env('POSTGRES_DB'),
        'USER': required_env('POSTGRES_USER'),
        'PASSWORD': required_env('POSTGRES_PASSWORD'),
        'HOST': required_env('POSTGRES_HOST'),
        'PORT': required_env('POSTGRES_PORT'),
    }
    postgres_sslmode = 'require'
else:
    postgres_config = {
        'NAME': os.getenv('POSTGRES_DB', 'repage'),
        'USER': os.getenv('POSTGRES_USER', 'repage'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'repage-local-only'),
        'HOST': os.getenv('POSTGRES_HOST', '127.0.0.1'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
    postgres_sslmode = os.getenv('POSTGRES_SSLMODE', 'prefer').strip()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        **postgres_config,
        'OPTIONS': {'sslmode': postgres_sslmode},
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'repage-default-cache',
    },
    'lead_protection': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'repage_lead_protection_cache',
    },
}

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = (
    Path(required_env('DJANGO_STATIC_ROOT'))
    if ENVIRONMENT == 'production'
    else Path(os.getenv('DJANGO_STATIC_ROOT', BASE_DIR / 'staticfiles'))
)
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

if ENVIRONMENT == 'production':
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SECURE_SSL_REDIRECT = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'
    X_FRAME_OPTIONS = 'DENY'

if ENVIRONMENT == 'production':
    CORS_ALLOWED_ORIGINS = env_list('DJANGO_CORS_ALLOWED_ORIGINS')
    if not CORS_ALLOWED_ORIGINS:
        raise ImproperlyConfigured(
            'DJANGO_CORS_ALLOWED_ORIGINS deve ser definido em produção.'
        )
else:
    CORS_ALLOWED_ORIGINS = env_list(
        'DJANGO_CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    )
CSRF_TRUSTED_ORIGINS = env_list('DJANGO_CSRF_TRUSTED_ORIGINS')
PRIVACY_POLICY_VERSION = (
    required_env('PRIVACY_POLICY_VERSION')
    if ENVIRONMENT == 'production'
    else os.getenv('PRIVACY_POLICY_VERSION', 'pre-launch-v1')
)

IDEMPOTENCY_TTL_SECONDS = env_int('IDEMPOTENCY_TTL_SECONDS', 86400, minimum=1)
LEAD_DUPLICATE_WINDOW_SECONDS = env_int('LEAD_DUPLICATE_WINDOW_SECONDS', 300, minimum=1)
LEAD_MIN_SUBMISSION_SECONDS = env_int('LEAD_MIN_SUBMISSION_SECONDS', 2, minimum=1)
LEAD_RATE_LIMIT_IP_SHORT_COUNT = env_int('LEAD_RATE_LIMIT_IP_SHORT_COUNT', 5, minimum=1)
LEAD_RATE_LIMIT_IP_SHORT_WINDOW_SECONDS = env_int('LEAD_RATE_LIMIT_IP_SHORT_WINDOW_SECONDS', 600, minimum=1)
LEAD_RATE_LIMIT_IP_DAILY_COUNT = env_int('LEAD_RATE_LIMIT_IP_DAILY_COUNT', 20, minimum=1)
LEAD_RATE_LIMIT_IP_DAILY_WINDOW_SECONDS = env_int('LEAD_RATE_LIMIT_IP_DAILY_WINDOW_SECONDS', 86400, minimum=1)
LEAD_RATE_LIMIT_EMAIL_COUNT = env_int('LEAD_RATE_LIMIT_EMAIL_COUNT', 3, minimum=1)
LEAD_RATE_LIMIT_EMAIL_WINDOW_SECONDS = env_int('LEAD_RATE_LIMIT_EMAIL_WINDOW_SECONDS', 1800, minimum=1)
LEAD_RATE_LIMIT_PHONE_COUNT = env_int('LEAD_RATE_LIMIT_PHONE_COUNT', 3, minimum=1)
LEAD_RATE_LIMIT_PHONE_WINDOW_SECONDS = env_int('LEAD_RATE_LIMIT_PHONE_WINDOW_SECONDS', 1800, minimum=1)
EMAIL_DELIVERY_LEASE_SECONDS = env_int('EMAIL_DELIVERY_LEASE_SECONDS', 300, minimum=1)
EMAIL_RETRY_BATCH_SIZE = env_int('EMAIL_RETRY_BATCH_SIZE', 10, minimum=1)
EMAIL_RETRY_DELAYS_SECONDS = tuple(
    env_int(f'EMAIL_RETRY_DELAY_{index}_SECONDS', value, minimum=1)
    for index, value in enumerate((900, 3600, 21600, 86400), start=1)
)

EMAIL_FROM_ADDRESS = (
    required_env('EMAIL_FROM_ADDRESS')
    if ENVIRONMENT == 'production'
    else os.getenv('EMAIL_FROM_ADDRESS', '').strip()
)
EMAIL_INTERNAL_RECIPIENT = (
    required_env('EMAIL_INTERNAL_RECIPIENT')
    if ENVIRONMENT == 'production'
    else os.getenv('EMAIL_INTERNAL_RECIPIENT', '').strip()
)
if ENVIRONMENT == 'production':
    EMAIL_BACKEND = os.getenv(
        'EMAIL_BACKEND',
        'django.core.mail.backends.smtp.EmailBackend',
    ).strip()
    if EMAIL_BACKEND != 'django.core.mail.backends.smtp.EmailBackend':
        raise ImproperlyConfigured('EMAIL_BACKEND deve usar o backend SMTP nativo em produção.')
    EMAIL_HOST = required_env('EMAIL_HOST')
    EMAIL_PORT = env_int('EMAIL_PORT', 587, minimum=1)
    EMAIL_HOST_USER = required_env('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = required_env('EMAIL_HOST_PASSWORD')
else:
    EMAIL_BACKEND = os.getenv(
        'EMAIL_BACKEND',
        'django.core.mail.backends.locmem.EmailBackend',
    ).strip()
    EMAIL_HOST = os.getenv('EMAIL_HOST', '').strip()
    EMAIL_PORT = env_int('EMAIL_PORT', 587, minimum=1)
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '').strip()
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
EMAIL_USE_TLS = env_bool('EMAIL_USE_TLS', False)
EMAIL_USE_SSL = env_bool('EMAIL_USE_SSL', False)
if EMAIL_USE_TLS and EMAIL_USE_SSL:
    raise ImproperlyConfigured('EMAIL_USE_TLS e EMAIL_USE_SSL não podem estar ativos simultaneamente.')
EMAIL_TIMEOUT = env_int('EMAIL_TIMEOUT', 5, minimum=1)
DEFAULT_FROM_EMAIL = EMAIL_FROM_ADDRESS

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}
