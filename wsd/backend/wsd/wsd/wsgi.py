"""
WSGI config for WSD project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wsd.settings")

application = get_wsgi_application()
