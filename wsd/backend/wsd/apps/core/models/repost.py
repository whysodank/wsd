from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from django.db import models
from django.utils.translation import gettext_lazy as _


@track_events
class Repost(BaseModel):
    initial = models.ForeignKey(
        "core.Post",
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name=_("Initial"),
        help_text=_(""),
    )
    repost = models.ForeignKey(
        "core.Post",
        on_delete=models.CASCADE,
        related_name="+",
        verbose_name=_("Post"),
        help_text=_("Repost"),
    )

    class Meta:
        verbose_name = _("Repost")
        verbose_name_plural = _("Repost")
