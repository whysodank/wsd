from admin_interface.models import Theme
from allauth.account.models import EmailAddress
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from django.contrib import admin

from .group import GroupAdmin
from .permission import PermissionAdmin
from .user import UserAdmin

admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialAccount)
admin.site.unregister(EmailAddress)
admin.site.unregister(Theme)

__all__ = [
    "UserAdmin",
    "GroupAdmin",
    "PermissionAdmin",
]
