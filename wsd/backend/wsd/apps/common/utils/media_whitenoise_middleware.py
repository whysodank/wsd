from urllib.parse import urlparse

from django.conf import settings
from django.urls import get_script_prefix
from whitenoise.base import decode_if_byte_string, ensure_leading_trailing_slash
from whitenoise.middleware import WhiteNoiseMiddleware


class MediaWhiteNoiseMiddleware(WhiteNoiseMiddleware):
    def configure_from_settings(self, settings):
        # Default configuration
        self.autorefresh = settings.DEBUG
        self.use_finders = settings.DEBUG
        self.static_prefix = urlparse(settings.MEDIA_URL or "").path
        script_prefix = get_script_prefix().rstrip("/")
        if script_prefix:
            if self.static_prefix.startswith(script_prefix):
                self.static_prefix = self.static_prefix[len(script_prefix):]
        if settings.DEBUG:
            self.max_age = 0
        # Allow settings to override default attributes
        for attr in self.config_attrs:
            settings_key = f"WHITENOISE_{attr.upper()}"
            try:
                value = getattr(settings, settings_key)
            except AttributeError:
                pass
            else:
                value = decode_if_byte_string(value)
                setattr(self, attr, value)
        self.static_prefix = ensure_leading_trailing_slash(self.static_prefix)
        self.static_root = decode_if_byte_string(settings.MEDIA_ROOT)

    def process_request(self, request):
        if not settings.DEBUG:
            return
        return super().process_request(request)
