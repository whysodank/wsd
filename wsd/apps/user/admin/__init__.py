from admin_interface.models import Theme
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from django.contrib import admin
from django_celery_beat.models import ClockedSchedule, CrontabSchedule, IntervalSchedule, PeriodicTask, SolarSchedule

from .group import GroupAdmin
from .permission import PermissionAdmin
from .user import UserAdmin

admin.site.unregister(ClockedSchedule)
admin.site.unregister(CrontabSchedule)
admin.site.unregister(IntervalSchedule)
admin.site.unregister(PeriodicTask)
admin.site.unregister(SolarSchedule)

admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialAccount)
# admin.site.unregister(EmailAddress)
admin.site.unregister(Theme)

__all__ = [
    "UserAdmin",
    "GroupAdmin",
    "PermissionAdmin",
]
