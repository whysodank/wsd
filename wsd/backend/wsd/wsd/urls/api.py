from django.urls import include, path

urlpatterns = [path("", include("apps.api.rest.api.urls"))]
