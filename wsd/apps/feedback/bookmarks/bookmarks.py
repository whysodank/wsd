from functools import lru_cache

from apps.common.models.base import BaseModel
from apps.common.utils import camel_to_snake, track_events
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

BOOKMARK_CLASS_ATTRIBUTE = "bookmark_class"


@lru_cache(maxsize=None)
def create_bookmark_class(klass):
    class Bookmark(BaseModel):
        REPR = "<{self.__class__.__name__}: {self.post} by {self.user}>"

        user = models.ForeignKey(
            get_user_model(),
            on_delete=models.CASCADE,
            related_name="+",
            verbose_name=_("User"),
            help_text=_("The user who bookmarked."),
        )
        post = models.ForeignKey(
            klass,
            on_delete=models.CASCADE,
            related_name="+",
            verbose_name=_("Post"),
            help_text=_("The post that is bookmarked."),
        )

        class Meta:
            abstract = True
            app_label = klass._meta.app_label

    klass_name = f"{klass.__name__}Bookmark"
    bases = (Bookmark,)

    class Meta:
        app_label = klass._meta.app_label
        verbose_name = _(f"{klass.__name__} Bookmark")
        verbose_name_plural = _(f"{klass._meta.verbose_name.title()} Bookmarks")
        constraints = [
            models.UniqueConstraint(
                fields=["user", "post"],
                name=f"unique_{camel_to_snake(klass_name)}",
            ),
        ]

    klass_dict = {"__module__": klass.__module__, "Meta": Meta}
    bookmark_class = track_events(app_label=klass._meta.app_label)(type(klass_name, bases, klass_dict))
    return bookmark_class


class BookmarkMaker:
    def __init__(self, related_name):
        self.related_name = related_name

    def contribute_to_class(self, cls, name):
        bookmark_class = create_bookmark_class(cls)
        setattr(cls, BOOKMARK_CLASS_ATTRIBUTE, bookmark_class)

        m2m_field = models.ManyToManyField(
            get_user_model(),
            through=bookmark_class,
            related_name=self.related_name,
            verbose_name=_("Bookmarked Users"),
            help_text=_("Users who bookmarked this item."),
        )
        m2m_field.contribute_to_class(cls, name)


def bookmarks(related_name):
    return BookmarkMaker(related_name=related_name)
