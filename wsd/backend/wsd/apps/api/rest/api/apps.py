from apps.common.apps import CommonConfig


class ApiRestApiConfig(CommonConfig):
    name = "apps.api.rest.api"

    def ready(self):
        ...
