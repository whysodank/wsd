from pathlib import Path

from dotenv import load_dotenv

from .config import CONFIG

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(dotenv_path=BASE_DIR.parent / ".env", verbose=True, override=False)

DEBUG = CONFIG.DEBUG
SECRET_KEY = CONFIG.SECRET_KEY
ALLOWED_HOSTS = CONFIG.ALLOWED_HOSTS

# Application definition
WSD_APPS_FIRST = [
    "apps.core.apps.CoreConfig",
    "apps.common.apps.CommonConfig",
    "apps.api.rest.api.apps.ApiRestApiConfig",
    "apps.api.rest.autocomplete_filters.apps.ApiRestAutocompleteFiltersConfig",
    "apps.api.rest.generic.apps.ApiRestGenericConfig"
]

THIRD_PARTY_APPS = [
    "pgtrigger",
    "pghistory",
    "pghistory.admin",
    "django_extensions",
    "django_hosts",
    "admin_auto_filters",
    "django_filters",
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
    "django_hosts.middleware.HostsRequestMiddleware",
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
        "NAME": CONFIG.DB.NAME,
        "USER": CONFIG.DB.USER,
        "PASSWORD": CONFIG.DB.PASSWORD,
        "HOST": CONFIG.DB.HOST,
        "PORT": CONFIG.DB.PORT,
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


REST_FRAMEWORK = {
    "PAGE_SIZE": 100,
    "DEFAULT_PAGINATION_CLASS": "apps.api.rest.paginators.CustomizablePageNumberPaginator",
    "DEFAULT_FILTER_BACKENDS": [
        "apps.api.rest.autocomplete_filters.backends.AutocompleteFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}
