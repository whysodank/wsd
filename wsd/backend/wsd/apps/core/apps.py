from apps.common.apps import CommonConfig


class CoreConfig(CommonConfig):
    name = "apps.core"

    def ready(self):
        ...
