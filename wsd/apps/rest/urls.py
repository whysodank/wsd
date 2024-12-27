from django.urls import include, path

urlpatterns = [
    path("v0/", include("apps.rest.v0.urls")),
]
