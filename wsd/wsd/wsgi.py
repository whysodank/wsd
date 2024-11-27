"""
WSGI config for WSD project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wsd.settings")


def monkeypatch__accept_self_signed_certs():
    # To get ume to work with self-signed certs in debug mode
    import ssl  # NOQA

    from django.conf import settings  # NOQA

    if settings.DEBUG:
        ssl._create_default_https_context = ssl._create_unverified_context  # NOQA


monkeypatch__accept_self_signed_certs()

application = get_wsgi_application()
