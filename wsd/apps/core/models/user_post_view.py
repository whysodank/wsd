from apps.common.models.base import BaseModel
from apps.common.utils import track_events
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _


@track_events()
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
        if user is not None:
            views = [cls(user=user, post=post) for post in posts]
            cls.objects.bulk_create(views)

    @classmethod
    def mark_post_viewed_by_user(cls, post, user):
        if user is not None:
            cls.mark_posts_viewed_by_user(post.as_queryset(), user)

    class Meta:
        verbose_name = _("User Post View")
        verbose_name_plural = _("User Post Views")
