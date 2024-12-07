def monkeypatch_accept_self_signed_certs():
    # To get ume to work with self-signed certs in debug mode
    import ssl  # NOQA

    from django.conf import settings  # NOQA

    if settings.DEBUG:
        ssl._create_default_https_context = ssl._create_unverified_context  # NOQA
