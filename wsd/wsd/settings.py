import itertools
from pathlib import Path

from corsheaders.defaults import default_headers

from .config import CONFIG as config  # Django thinks CONFIG is a settings if it is all caps  # NOQA

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = config.DEBUG
SECRET_KEY = config.SECRET_KEY
ALLOWED_HOSTS = config.ALLOWED_HOSTS
PROTOCOL = "https" if not DEBUG else "http"

# Application definition
WSD_APPS_FIRST = [
    "apps.core.apps.CoreConfig",
    "apps.common.apps.CommonConfig",
]

THIRD_PARTY_APPS = [
    "whitenoise.runserver_nostatic",
    "pgtrigger",
    "pghistory",
    "pghistory.admin",
    "django_extensions",
    "django_hosts",
    "admin_auto_filters",
    "django_filters",
    "django_object_actions",
    # Auth libraries
    "allauth",
    "allauth.headless",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.microsoft",
    "allauth.socialaccount.providers.apple",
    "allauth.socialaccount.providers.github",
    "allauth.socialaccount.providers.discord",
    "allauth.socialaccount.providers.reddit",
    #
    "sslserver",
    "corsheaders",
    "drf_spectacular",
]

BUILTIN_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

WSD_APPS_LAST = [
    "apps.user.apps.UserConfig",
]

INSTALLED_APPS = WSD_APPS_FIRST + THIRD_PARTY_APPS + BUILTIN_APPS + WSD_APPS_LAST

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "apps.common.utils.media_whitenoise_middleware.MediaWhiteNoiseMiddleware",
    "django_hosts.middleware.HostsRequestMiddleware",
    "pghistory.middleware.HistoryMiddleware",
    # "django.contrib.sessions.middleware.SessionMiddleware",
    "apps.core.middleware.session.CookieORHeaderSessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django_hosts.middleware.HostsResponseMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "wsd.urls.root"
ROOT_HOSTCONF = "wsd.hosts"
DEFAULT_HOST = "root"
HOST = config.HOSTS.DOMAIN
SESSION_COOKIE_DOMAIN = f".{HOST}"

APEX_DOMAIN = config.HOSTS.DOMAIN
ADMIN_SUBDOMAIN = config.HOSTS.ADMIN_SUBDOMAIN
API_SUBDOMAIN = config.HOSTS.API_SUBDOMAIN

PARENT_HOST = config.HOSTS.DOMAIN

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
            "builtins": [
                "django.templatetags.i18n",
            ],
        },
    },
]

WSGI_APPLICATION = "wsd.wsgi.application"

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config.DB.NAME,
        "USER": config.DB.USER,
        "PASSWORD": config.DB.PASSWORD,
        "HOST": config.DB.HOST,
        "PORT": config.DB.PORT,
    }
}

# Authentication
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 16}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = "user.User"

ACCOUNT_ADAPTER = "apps.core.backends.allauth.WSDAllauthAccountAdapter"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_LOGOUT_ON_PASSWORD_CHANGE = False
ACCOUNT_EMAIL_VERIFICATION_BY_CODE_ENABLED = False

SOCIALACCOUNT_EMAIL_AUTHENTICATION = True
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True
SOCIALACCOUNT_STORE_TOKENS = True

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]
HEADLESS_ONLY = True
HEADLESS_FRONTEND_URLS = {
    "account_confirm_email": f"{PROTOCOL}://{HOST}/auth/verify-email/{{key}}",
    "account_signup": f"{PROTOCOL}://{HOST}/auth/signup",
    "account_reset_password": f"{PROTOCOL}://{HOST}/auth/password-reset",
    "account_reset_password_from_key": f"{PROTOCOL}://{HOST}/auth/password-reset/{{key}}",
    "socialaccount_login_error": f"{PROTOCOL}://{HOST}/auth/provider-error",
}


SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": config.OAUTH.GOOGLE.CLIENT_ID,
            "secret": config.OAUTH.GOOGLE.CLIENT_SECRET,
        },
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {
            "access_type": "offline",
        },
        "OAUTH_PKCE_ENABLED": True,
    },
    "microsoft": {
        "APPS": [
            {
                "client_id": config.OAUTH.MICROSOFT.CLIENT_ID,
                "secret": config.OAUTH.MICROSOFT.CLIENT_SECRET,
                "settings": {
                    "tenant": "consumers",
                },
            },
        ],
    },
    "reddit": {
        "APP": {
            "client_id": config.OAUTH.REDDIT.CLIENT_ID,
            "secret": config.OAUTH.REDDIT.CLIENT_SECRET,
        },
        "AUTH_PARAMS": {"duration": "permanent"},
        "SCOPE": ["identity"],
        "USER_AGENT": f"web:{config.OAUTH.REDDIT.CLIENT_ID}:0.1.0 (by /u/{config.OAUTH.REDDIT.APP_OWNER_USERNAME})",
    },
    "discord": {
        "APP": {
            "client_id": config.OAUTH.DISCORD.CLIENT_ID,
            "secret": config.OAUTH.DISCORD.CLIENT_SECRET,
        },
        "SCOPE": ["identify", "email"],
    },
    "github": {
        "APP": {
            "client_id": config.OAUTH.GITHUB.CLIENT_ID,
            "secret": config.OAUTH.GITHUB.CLIENT_SECRET,
        },
        "SCOPE": ["user"],
    },
}


CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_HEADER_NAME = "X-Session-Token"

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
MEDIA_URL = f"https://{HOST}/media/"
MEDIA_ROOT = BASE_DIR / "mediafiles"

X_FRAME_OPTIONS = "SAMEORIGIN"

REST_FRAMEWORK = {
    "PAGE_SIZE": 100,
    "DEFAULT_PAGINATION_CLASS": "apps.rest.utils.pagination.PageNumberPagination",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PERMISSION_CLASSES": [
        "apps.rest.utils.permissions.ReadOnly",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "WSD API",
    "DESCRIPTION": f"WSD API",
    "VERSION": "0.1.0",
    "COMPONENT_SPLIT_REQUEST": True,
}

http_https = lambda domain: [f"http://{domain}", f"https://{domain}"]  # NOQA

DOMAINS = [
    APEX_DOMAIN,
    f"{ADMIN_SUBDOMAIN}.{APEX_DOMAIN}",
    f"{API_SUBDOMAIN}.{APEX_DOMAIN}",
]

CORS_ALLOWED_ORIGINS = list(itertools.chain.from_iterable(map(http_https, DOMAINS)))
CSRF_TRUSTED_ORIGINS = list(itertools.chain.from_iterable(map(http_https, DOMAINS)))
CORS_ALLOW_HEADERS = default_headers + (SESSION_HEADER_NAME,)
CORS_ALLOW_CREDENTIALS = True

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config.EMAIL.SMTP.HOST
EMAIL_PORT = config.EMAIL.SMTP.PORT.TSL
EMAIL_HOST_USER = config.EMAIL.SMTP.USER
EMAIL_HOST_PASSWORD = config.EMAIL.SMTP.PASSWORD
EMAIL_USE_TSL = True
DEFAULT_AUTH_FROM_EMAIL = config.EMAIL.DEFAULT_AUTH_FROM_EMAIL


if DEBUG:
    # Some stuff here are hardcoded, like devports.
    # This would break for instance when the ports change for development servers
    # TODO: handle these better
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
    DOMAINS = [
        APEX_DOMAIN,
        f"{ADMIN_SUBDOMAIN}.{APEX_DOMAIN}",
        f"{API_SUBDOMAIN}.{APEX_DOMAIN}",
    ]
    PORTS = ["80", "3000"]
    ORIGINS = [f"http://{domain}:{port}" for domain in DOMAINS for port in PORTS]

    CORS_ALLOWED_ORIGINS = ORIGINS
    CSRF_TRUSTED_ORIGINS = ORIGINS
