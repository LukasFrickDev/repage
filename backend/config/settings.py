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
    'django.contrib.admin',
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
else:
    postgres_config = {
        'NAME': os.getenv('POSTGRES_DB', 'repage'),
        'USER': os.getenv('POSTGRES_USER', 'repage'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'repage-local-only'),
        'HOST': os.getenv('POSTGRES_HOST', '127.0.0.1'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }

DATABASES = {'default': {'ENGINE': 'django.db.backends.postgresql', **postgres_config}}

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

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

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
}
