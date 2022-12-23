from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models.base import BaseModel
from apps.common.utils import track_events


@track_events
class UserPostView(BaseModel):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="post_views",
        verbose_name=_("User"),
        help_text=_("The user who viewed the post."),
    )
    post = models.ForeignKey(
        "core.Post",
        on_delete=models.CASCADE,
        related_name="post_views",
        verbose_name=_("Post"),
        help_text=_("The post that is viewed."),
    )

    @classmethod
    def mark_posts_viewed_by_user(cls, posts, user):
        views = [cls(user=user, post=post) for post in posts]
        cls.objects.bulk_create(views)

    class Meta:
        verbose_name = _("User Post View")
        verbose_name_plural = _("User Post Views")
