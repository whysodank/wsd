from django_hosts import host, patterns

host_patterns = patterns(
    "wsd.urls",
    host(r"admin", "admin", name="admin"),
    host(r"", "root", name="root"),
)
