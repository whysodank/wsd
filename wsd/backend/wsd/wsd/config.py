from iubeo import boolean, comma_separated_list, config

CONFIG = config(
    {
        "DEBUG": boolean,
        "DB": {
            "NAME": str,
            "USER": str,
            "PASSWORD": str,
            "HOST": str,
            "PORT": str,
        },
        "SECRET_KEY": str,
        "HOST": str,
        "ALLOWED_HOSTS": comma_separated_list,
    },
    prefix="WSD",
)
