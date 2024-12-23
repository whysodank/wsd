from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config, string

load_dotenv(verbose=True, override=False)

CONFIG = config(
    {
        "NAME": string(),
        "NAME_SHORT": string(),
        "DEBUG": boolean(),
        "DB": {
            "NAME": string(),
            "USER": string(),
            "PASSWORD": string(),
            "HOST": string(),
            "PORT": string(),
        },
        "SECRET_KEY": string(),
        "HOSTS": {
            "DOMAIN": string(),
            "API_SUBDOMAIN": string(),
            "ADMIN_SUBDOMAIN": string(),
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
                "HOST": str,
                "PORT": {"TSL": int},
                "USER": str,
                "PASSWORD": str,
            },
            "DEFAULT_AUTH_FROM_EMAIL": str,
        },
    },
    prefix="WSD",
)
