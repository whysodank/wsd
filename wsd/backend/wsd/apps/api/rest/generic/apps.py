from django.apps import AppConfig


class ApiRestGenericConfig(AppConfig):
    name = "apps.api.rest.generic"

    def ready(self):
        ...
