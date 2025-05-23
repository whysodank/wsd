from functools import lru_cache

from apps.common.models.base import BaseModel
from apps.common.utils import camel_to_snake, track_events
from apps.feedback.comments.tiptap import get_mentions
from apps.feedback.votes import votes
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

COMMENT_CLASS_ATTRIBUTE = "comment_class"


@lru_cache(maxsize=None)
def create_comment_class(klass, name, comment_min_length=0, comment_max_length=1000):
    class Comment(BaseModel):
        REPR = "<{self.__class__.__name__}: {self.post} by {self.user}>"
        COMMENT_MIN_LENGTH = comment_min_length
        COMMENT_MAX_LENGTH = comment_max_length

        user = models.ForeignKey(
            get_user_model(),
            on_delete=models.CASCADE,
            related_name=f"{camel_to_snake(klass.__name__)}_comments",
            verbose_name=_("User"),
            help_text=_("User who wrote this comment."),
        )
        post = models.ForeignKey(
            klass,
            on_delete=models.CASCADE,
            related_name=name,
            verbose_name=_("Post"),
            help_text=_("The post this comment is for."),
        )

        body = models.JSONField(
            verbose_name=_("Body"),
            help_text=_("The actual comment as JSON."),
            # TipTap format
        )

        @property
        def mentions(self):
            return get_user_model().objects.filter(username__in=get_mentions(self.body))

        class Meta:
            abstract = True
            app_label = klass._meta.app_label  # NOQA

    klass_name = f"{klass.__name__}Comment"
    bases = (Comment,)

    class Meta:
        app_label = klass._meta.app_label  # NOQA
        verbose_name = _(f"{klass.__name__} Comment")
        verbose_name_plural = _(f"{klass.__name__} Comments")
        constraints = [
            models.CheckConstraint(
                check=models.Q(body__length__gte=comment_min_length),
                name=f"{camel_to_snake(klass_name)}_comment_minimum_length",
            ),
            models.CheckConstraint(
                check=models.Q(body__length__lte=comment_max_length),
                name=f"{camel_to_snake(klass_name)}_comment_maximum_length",
            ),
        ]

    klass_dict = {"__module__": klass.__module__, "Meta": Meta, "votes": votes()}
    comment_class = track_events(app_label=klass._meta.app_label)(type(klass_name, bases, klass_dict))  # NOQA
    return comment_class


class CommentMaker:
    def __init__(self, **kwargs):
        self.comment_min_length = kwargs.get("comment_min_length")
        self.comment_max_length = kwargs.get("comment_max_length")

    def contribute_to_class(self, cls, name):
        comment_class = create_comment_class(cls, name, self.comment_min_length, self.comment_max_length)
        setattr(cls, COMMENT_CLASS_ATTRIBUTE, comment_class)


def comments(comment_min_length=0, comment_max_length=1000):
    comment_maker = CommentMaker(
        comment_min_length=comment_min_length,
        comment_max_length=comment_max_length,
    )
    return comment_maker
