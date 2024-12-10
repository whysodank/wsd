from django.urls import include, path

urlpatterns = [
    path("v1/", include("apps.rest.v1.urls")),
]
