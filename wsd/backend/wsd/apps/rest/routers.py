from rest_framework.routers import DefaultRouter


class Router(DefaultRouter):
    def register_viewset(self, viewset):
        self.register(
            viewset.endpoint,
            viewset,
            basename=viewset.endpoint,
        )
