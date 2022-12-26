from django.urls import include, path

app_name = "rest"
urlpatterns = [
    # All url patterns here ideally must be versioned includes of the sub apps like v1, v2
    # Not really a good idea to include a non versioned url and point it to say the latest or the initial version
    path("v1/", include(("apps.rest.v1.urls", app_name), namespace="v1")),
]
