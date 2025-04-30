from apps.common.models.base import BaseModel
from apps.common.models.fields import AutoGenericForeignKey
from apps.common.utils.db import get_longest_choice_length, track_events
from apps.common.utils.pyutils import Sentinel
from apps.core.models import Post
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django.utils.translation import ngettext


@track_events()
class Notification(BaseModel):
    class EVENTS(models.TextChoices):
        LIKE = "LIKE", _("Like")
        COMMENT = "COMMENT", _("Comment")
        COMMENT_MENTION = "COMMENT_MENTION", _("Comment Mention")

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
    def get_for_post(cls, post):
        """Returns all the notifications for a given post, these can be from votes, comments, or comment votes."""

        post_notifications = Q(
            object_of_interest_content_type=ContentType.objects.get_for_model(Post),
            object_of_interest_object_id=post.id,
        )

        post_comment_notifications = Q(
            object_of_interest_content_type=ContentType.objects.get_for_model(Post.comment_class),
            object_of_interest_object_id__in=post.comments.values_list("id", flat=True),
        )

        return cls.objects.filter(post_notifications | post_comment_notifications)

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
    if vote_obj.post.user != vote_obj.user:
        total = vote_obj.post.votes.exclude(user=vote_obj.post.user).filter(body=vote_obj.VoteType.UPVOTE).count()
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
    if comment_obj.post.user != comment_obj.user:
        Notification.objects.create(
            event=Notification.EVENTS.COMMENT,
            user=comment_obj.post.user,
            description=_(f"{comment_obj.user} commented on your {comment_obj.post._meta.verbose_name.lower()}."),
            object_of_interest=comment_obj,
        )


@Notification.register_notification_moment(Post.comment_class)
def comment_mention_notification(comment_obj):
    notifications = [
        Notification(
            event=Notification.EVENTS.COMMENT_MENTION,
            user=mentioned_user,
            description=_(f"{comment_obj.user} mentioned you in a comment."),
            object_of_interest=comment_obj,
        )
        for mentioned_user in comment_obj.mentions
    ]
    Notification.objects.bulk_create(notifications)
