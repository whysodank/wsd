from .allauth import monkeypatch_allauth_username_email_login
from .drf_spectacular import monkeypatch_drf_spectacular
from .ssl import monkeypatch_accept_self_signed_certs

__all__ = [
    "monkeypatch_drf_spectacular",
    "monkeypatch_accept_self_signed_certs",
    "monkeypatch_allauth_username_email_login",
]
