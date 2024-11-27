from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from apps.feedback.user import UserVoteMixin
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


@track_events()
class User(UserVoteMixin, AbstractUser, BaseModel):
    REPR = "{self.username}"

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
