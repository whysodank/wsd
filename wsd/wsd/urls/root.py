from django.urls import include, path

urlpatterns = [
    path("/", include("apps.rest.urls")),
    path("health-check/", include("health_check.urls")),
]
