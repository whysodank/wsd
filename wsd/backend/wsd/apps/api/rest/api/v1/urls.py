from django.urls import path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view

router = DefaultRouter()
SCHEMA_URL_NAME = "openapi-schema-v1"

urlpatterns = [
    path(
        "openapi-schema/",
        get_schema_view(
            title="Why So Dank",
            description="WSD Open API V1 Documentation + schema.",
            version="1.0.0",
            patterns=router.urls,
        ),
        name=SCHEMA_URL_NAME,
    ),
    path(
        "redoc/",
        TemplateView.as_view(
            template_name="rest_framework/redoc.html",
            extra_context={"schema_url": f"rest:v1:{SCHEMA_URL_NAME}"},
        ),
        name="redoc",
    ),
    path(
        "swagger/",
        TemplateView.as_view(
            template_name="rest_framework/swagger.html",
            extra_context={"schema_url": f"rest:v1:{SCHEMA_URL_NAME}"},
        ),
        name="swagger",
    ),
    *router.urls,
]
