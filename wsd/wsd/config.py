from dotenv import load_dotenv
from iubeo import boolean, comma_separated_list, config, string

load_dotenv(verbose=True, override=False)

CONFIG = config(
    {
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
        },
        "EMAIL": {
            "SMTP": {
                "HOST": str,
                "PORT": {"TSL": int},
                "USER": str,
                "PASSWORD": str,
            },
            "DEFAULT_VERIFICATION_FROM_EMAIL": str,
        },
    },
    prefix="WSD",
)
