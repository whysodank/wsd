from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config, string

load_dotenv(verbose=True, override=False)

CONFIG = config(
    {
        "NAME": string(),
        "NAME_SHORT": string(),
        "DEBUG": boolean(),
        "PROTOCOL": string(),
        "DB": {
            "NAME": string(),
            "USER": string(),
            "PASSWORD": string(),
            "HOST": string(),
            "PORT": string(),
        },
        "STORAGE": {
            "S3": {
                "BUCKET_NAME": string(missing_default=None),
                "ENDPOINT_URL": string(missing_default=None),
                "ACCESS_KEY_ID": string(missing_default=None),
                "SECRET_ACCESS_KEY": string(missing_default=None),
            }
        },
        "SECRET_KEY": string(),
        "HOSTS": {
            "DOMAIN": string(),
            "API_SUBDOMAIN": string(),
            "ADMIN_SUBDOMAIN": string(),
            "AUTH_SUBDOMAIN": string(),
            "MEDIA_SUBDOMAIN": string(),
        },
        "ALLOWED_HOSTS": comma_separated_list(),
        "OAUTH": {
            "GOOGLE": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
            },
            "MICROSOFT": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
            },
            "REDDIT": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
                "APP_OWNER_USERNAME": string(),
            },
            "DISCORD": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
            },
            "GITHUB": {
                "CLIENT_ID": string(),
                "CLIENT_SECRET": string(),
            },
        },
        "EMAIL": {
            "SMTP": {
                "HOST": string(),
                "PORT": {"TSL": string()},
                "USER": string(),
                "PASSWORD": string(),
            },
            "DEFAULT_AUTH_FROM_EMAIL": string(),
        },
        "DEVTOOLS": {
            "SENTRY": {
                "DSN": string(),
                "TRACES_SAMPLE_RATE": string(),
            },
        },
        "SETUP": {
            "SUPERUSER": {
                "USERNAME": string(),
                "EMAIL": string(),
                "PASSWORD": string(),
            },
        },
        "CELERY": {
            "BROKER_URL": string(),
        },
    },
    prefix="WSD",
)
