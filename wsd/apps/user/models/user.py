import uuid
from io import BytesIO

import robohash
from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from apps.core.managers import UserManager
from apps.feedback import UserBookmarkMixin, UserVoteMixin
from django.contrib.auth.models import AbstractUser
from django.core.files.base import ContentFile
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_lifecycle import AFTER_CREATE, hook


@track_events()
class User(UserVoteMixin, UserBookmarkMixin, AbstractUser, BaseModel):
    REPR = "<User: {self.username}>"

    UNUSABLE_USERNAME_PREFIX = "!"
    SIGNUP_COMPLETED_FIELD = "signup_completed"

    AVATAR_DIRECTORY = "avatars"

    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[a-z][a-z0-9_]*\Z",
                message=(
                    "Enter a valid username. "
                    "It must start with a lowercase letter and contain only lowercase letters, digits, or underscores."
                ),
            )
        ],
        help_text=_(
            "Required. 150 characters or fewer. "
            "It must start with a lowercase letter and contain only lowercase letters, digits, or underscores."
        ),
    )
    avatar = models.ImageField(
        upload_to=AVATAR_DIRECTORY,
        blank=True,
        null=True,
        help_text=_("User's avatar image."),
    )

    objects = UserManager()

    def set_unusable_username(self):
        setattr(self, self.USERNAME_FIELD, f"{self.UNUSABLE_USERNAME_PREFIX}{uuid.uuid4()}")

    @property
    def has_unusable_username(self):
        return self.username and self.username.startswith(self.UNUSABLE_USERNAME_PREFIX)

    def save(self, *args, **kwargs):
        if self.has_unusable_username:
            with self.skip_field_validators("username"):
                return super().save(*args, **kwargs)
        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    @hook(AFTER_CREATE)
    def set_default_avatar(self):
        if not self.avatar:
            self.set_avatar_from_hash(self.username)

    def set_random_avatar(self):
        self.set_avatar_from_hash(str(uuid.uuid4()))

    def set_avatar_from_hash(self, avatar_hash):
        rh = robohash.Robohash(avatar_hash)
        rh.assemble(roboset="set1", bgset=None, sizex=128, sizey=128)
        image = BytesIO()
        rh.img.save(image, format="png")
        self.avatar.save(f"{self.id}.png", ContentFile(image.getvalue()), save=True)
