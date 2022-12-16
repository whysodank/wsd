from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from apps.common.models.base import Base
from apps.common.utils.db import track_events


@track_events
class User(AbstractUser, Base):
    REPR = "{self.username}"

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
