"""
WSGI config for WSD project.
"""

import os

from django.core.wsgi import get_wsgi_application

from wsd.monkeypatches import monkeypatch_accept_self_signed_certs, monkeypatch_drf_spectacular

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wsd.settings")

monkeypatch_drf_spectacular()
monkeypatch_accept_self_signed_certs()

application = get_wsgi_application()
