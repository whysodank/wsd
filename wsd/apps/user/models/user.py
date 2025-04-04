import uuid

from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from apps.core.managers import UserManager
from apps.feedback import UserBookmarkMixin, UserVoteMixin
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


@track_events()
class User(UserVoteMixin, UserBookmarkMixin, AbstractUser, BaseModel):
    REPR = "<User: {self.username}>"

    UNUSABLE_USERNAME_PREFIX = "!"
    SIGNUP_COMPLETED_FIELD = "signup_completed"

    objects = UserManager()

    def set_unusable_username(self):
        setattr(self, self.USERNAME_FIELD, f"{self.UNUSABLE_USERNAME_PREFIX}{uuid.uuid4()}")

    @property
    def has_unusable_username(self):
        return self.username.startswith(self.UNUSABLE_USERNAME_PREFIX)

    def save(self, *args, **kwargs):
        if self.has_unusable_username:
            with self.skip_field_validators("username"):
                return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
