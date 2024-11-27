from allauth.socialaccount.models import SocialApp, SocialToken
from django.contrib import admin

from .group import GroupAdmin
from .permission import PermissionAdmin
from .user import UserAdmin

admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)

__all__ = [
    "UserAdmin",
    "GroupAdmin",
    "PermissionAdmin",
]
