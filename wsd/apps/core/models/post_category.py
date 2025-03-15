from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from django.core.validators import validate_slug
from django.db import models
from django.utils.translation import gettext_lazy as _


@track_events()
class PostCategory(BaseModel):
    REPR = "<PostCategory: {self.name}>"
    STR = "{self.name}"
    name = models.CharField(
        max_length=100,
        verbose_name=_("Name"),
        help_text=_("Name of the category."),
        unique=True,
    )
    handle = models.SlugField(
        max_length=100,
        verbose_name=_("Slug/Handle"),
        unique=True,
        null=False,
        blank=False,
        db_index=True,
        validators=[validate_slug],
        help_text=_("Slug/Handle of the category."),
    )
    icon = models.TextField(
        verbose_name=_("Icon"),
        help_text=_("Icon for the category, in svg format."),
        # We don't validate the svg here since this is an admin only feature
        # TODO: In the future we can add some xml+svg schema validation here
    )

    class Meta:
        verbose_name = _("Post Category")
        verbose_name_plural = _("Post Categories")
