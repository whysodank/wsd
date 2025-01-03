from django.conf import settings
from django_hosts import host, patterns

host_patterns = patterns(
    "wsd.urls",
    host(settings.ADMIN_SUBDOMAIN, "admin", name="admin"),
    host(settings.API_SUBDOMAIN, "rest", name="api"),
    host(settings.AUTH_SUBDOMAIN, "auth", name="auth"),
    host(r"", "root", name="root"),
)
