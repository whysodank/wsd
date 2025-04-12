from apps.rest.v0.views import (
    NotificationViewSet,
    PostCategoryViewSet,
    PostCommentViewSet,
    PostTagViewSet,
    PostViewSet,
    UserViewSet,
)
from django.urls import include, path, reverse_lazy
from drf_spectacular.utils import extend_schema
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView
from rest_framework.routers import DefaultRouter

DefaultRouter.include_root_view = False
router = DefaultRouter()

viewsets = [UserViewSet, PostViewSet, PostTagViewSet, PostCommentViewSet, PostCategoryViewSet, NotificationViewSet]

for viewset in viewsets:
    router.register(viewset.endpoint, viewset, basename=viewset.endpoint)

# Documentation

SCHEMA_URL_NAME = "openapi-schema-v0"

v0_urlpatterns = [
    path(
        "openapi-schema/",
        extend_schema(exclude=True)(SpectacularAPIView).as_view(),
        name=SCHEMA_URL_NAME,
    ),
    path(
        "redoc/",
        SpectacularRedocView.as_view(url=reverse_lazy(f"rest:v0:{SCHEMA_URL_NAME}")),
        name="redoc",
    ),
    *router.urls,
]

app_name = "rest"
urlpatterns = [
    # All url patterns here ideally must be versioned includes of the sub apps like v0, v1, v2
    # Not really a good idea to include a non versioned url and point it to say the latest or the initial version
    # v0 means it is subject to change without notice - it is not a stable version and is not open to public yet.
    path("", include((v0_urlpatterns, "apps.rest.v0"), namespace="v0")),
]
