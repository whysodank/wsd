from apps.common.models.base import BaseModel
from apps.common.models.fields import AutoGenericForeignKey
from apps.common.utils.db import get_longest_choice_length, track_events
from apps.common.utils.pyutils import Sentinel
from apps.core.models import Post
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django.utils.translation import ngettext


@track_events()
class Notification(BaseModel):
    class EVENTS(models.TextChoices):
        LIKE = "LIKE", _("Like")
        COMMENT = "COMMENT", _("Comment")

    event = models.CharField(
        verbose_name=_("Event"),
        help_text=_("Event Type"),
        choices=EVENTS.choices,
        max_length=get_longest_choice_length(EVENTS),
        null=False,
        blank=False,
    )

    user = models.ForeignKey(
        to=get_user_model(),
        on_delete=models.CASCADE,
        related_name="notifications",
        help_text=_("User who received this notification."),
    )

    object_of_interest = AutoGenericForeignKey(limit_models_to=[Post, Post.comment_class])

    description = models.TextField(
        verbose_name=_("Description"),
        help_text=_("Description of the notification. This is what the users will see."),
    )

    is_read = models.BooleanField(
        default=False,
        verbose_name=_("Is read"),
        help_text=_("Whether the notification has been read or not."),
    )

    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")

    @classmethod
    def register_notification_moment(cls, model, **kwargs):
        # When a model is created, if kwargs match the instance, call the registered function with the instance
        def decorator(func):
            @receiver(post_save, sender=model, weak=False)
            def wrapper(**signal_kwargs):
                created, instance = signal_kwargs.get("created", False), signal_kwargs.get("instance", None)
                no_value = Sentinel("NO_VALUE")
                return created and all((getattr(model, k, no_value) == v for k, v in kwargs.items())) and func(instance)

            return func

        return decorator


@Notification.register_notification_moment(Post.vote_class)
@Notification.register_notification_moment(Post.comment_class.vote_class)
def like_notification(vote_obj):
    total = vote_obj.post.votes.filter(body=vote_obj.VoteType.UPVOTE).count()
    if total in [1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000]:
        # We may want to add a digest to the Notification model so someone can't keep
        # unlike and re-like to notify the post owner multiple times
        Notification.objects.create(
            event=Notification.EVENTS.LIKE,
            user=vote_obj.post.user,
            description=ngettext(
                f"Your {vote_obj.post._meta.verbose_name.lower()} has received {total} vote.",
                f"Your {vote_obj.post._meta.verbose_name.lower()} has received {total} votes.",
                total,
            ),
            object_of_interest=vote_obj.post,
        )


@Notification.register_notification_moment(Post.comment_class)
def comment_notification(comment_obj):
    Notification.objects.create(
        event=Notification.EVENTS.COMMENT,
        user=comment_obj.post.user,
        description=_(f"{comment_obj.user} commented on your {comment_obj.post._meta.verbose_name.lower()}."),
        object_of_interest=comment_obj.post,
    )
