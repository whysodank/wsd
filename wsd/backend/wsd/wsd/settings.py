from pathlib import Path

from dotenv import load_dotenv

from .config import CONFIG as config  # Django thinks CONFIG is a settings if it is all caps  # NOQA

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(dotenv_path=BASE_DIR.parent / ".env", verbose=True, override=False)

DEBUG = config.DEBUG
SECRET_KEY = config.SECRET_KEY
ALLOWED_HOSTS = config.ALLOWED_HOSTS

# Application definition
WSD_APPS_FIRST = [
    "apps.core.apps.CoreConfig",
    "apps.common.apps.CommonConfig",
    "apps.rest.apps.RestConfig",
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
    # DRF + DRF libraries
    "rest_framework",
    "rest_framework.authtoken",
    # Auth libraries
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth.socialaccount.providers.google",
    "sslserver",
]

BUILTIN_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
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
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django_hosts.middleware.HostsResponseMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "wsd.urls.root"
ROOT_HOSTCONF = "wsd.hosts"
DEFAULT_HOST = "root"
HOST = config.HOST
SESSION_COOKIE_DOMAIN = f".{HOST}"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
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
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 10}},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = "user.User"
ACCOUNT_ADAPTER = "apps.user.allauth.account_adapter.AccountAdapter"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"

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
MEDIA_URL = f"/media/"
MEDIA_ROOT = BASE_DIR / "mediafiles"

REST_FRAMEWORK = {
    "PAGE_SIZE": 100,
    "DEFAULT_PAGINATION_CLASS": "apps.rest.paginators.CustomizablePageNumberPaginator",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# TODO: document this
# And maybe a better way to do this?
CLIENT_EMAIL_VERIFICATION_PAGE_URL = f"{HOST}/registration/verify-email/?token={{}}"
