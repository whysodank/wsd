from functools import lru_cache

from apps.common.models.base import BaseModel
from apps.common.utils import camel_to_snake, track_events
from django.core.validators import RegexValidator
from django.db import models
from django.db.models.manager import Manager
from django.utils.translation import gettext_lazy as _

TAG_NAME_REGEX = r"^[a-zA-Z0-9_.-]*$"
TAG_NAME_REGEX_ERROR_MESSAGE = "Tags can only contain letters, numbers, - and _."


class TagQuerySet(models.QuerySet):
    def to_list(self):
        return list(self.all().values_list("name", flat=True))

    def get_tag(self, **kwargs):
        return self.create(**kwargs)

    def create(self, **kwargs):
        if tag := self.filter(name=kwargs.get("name")).first():  # NOQA
            return tag
        return super().create(**kwargs)

    def bulk_create(self, objs, **kwargs):
        return self.filter(id__in=[self.get_tag(name=obj.name).id for obj in objs])


class TagManager(Manager.from_queryset(TagQuerySet)):
    def from_list(self, tag_list):
        tag_ids = [self.get_tag(name=tag).id for tag in tag_list]
        return self.filter(pk__in=tag_ids)  # NOQA


@lru_cache(maxsize=None)
def create_tag_class(klass):
    class Tag(BaseModel):
        objects = TagManager()
        REPR = "<{self.__class__.__name__}: {self.name}>"
        name = models.CharField(
            max_length=100,
            verbose_name=_("Name"),
            help_text=_("The tag's name, the tag itself."),
            validators=[RegexValidator(TAG_NAME_REGEX, TAG_NAME_REGEX_ERROR_MESSAGE)],
            unique=True,
        )

        def save(self, *args, **kwargs):
            if tag := self.__class__.objects.filter(name=self.name).first():  # NOQA
                return tag
            return super().save(*args, **kwargs)

        def __len__(self):
            # Hack for length validators to work on this,
            # Required for tags.drf TagSerializer
            return len(self.name)

        class Meta:
            abstract = True
            app_label = klass._meta.app_label  # NOQA

    klass_name = f"{klass.__name__}Tag"
    bases = (Tag,)

    class Meta:
        app_label = klass._meta.app_label  # NOQA
        verbose_name = _(f"{klass.__name__} Tag")
        verbose_name_plural = _(f"{klass._meta.verbose_name.title()} Tags")  # NOQA

    klass_dict = {"__module__": klass.__module__, "Meta": Meta}
    tag_class = track_events(app_label=klass._meta.app_label)(type(klass_name, bases, klass_dict))  # NOQA
    return tag_class


@lru_cache(maxsize=None)
def create_object_tag_class(klass, name):
    klass_name = f"{klass.__name__}ObjectTag"

    class ObjectTag(BaseModel):
        REPR = f"<{klass_name}: {{self.post}} tagged {{self.tag}}>"
        tag = models.ForeignKey(
            create_tag_class(klass),
            on_delete=models.CASCADE,
            related_name=f"{camel_to_snake(klass.__name__)}_tags",
            verbose_name=_("Tag"),
            help_text=_("The Tag."),
        )
        post = models.ForeignKey(
            klass,
            on_delete=models.CASCADE,
            related_name=f"{camel_to_snake(klass.__name__)}_tags",
            verbose_name=_("Post"),
            help_text=_("The post this tag is for."),
        )

        class Meta:
            abstract = True
            app_label = klass._meta.app_label  # NOQA

    bases = (ObjectTag,)

    class Meta:
        # auto_created = True  # Hack
        app_label = klass._meta.app_label  # NOQA
        verbose_name = _(f"{klass.__name__} Object Tag")
        verbose_name_plural = _(f"{klass._meta.verbose_name.title()} Object Tags")  # NOQA
        constraints = [
            models.UniqueConstraint(
                fields=["tag", "post"],
                name=f"unique_{camel_to_snake(klass_name)}",
            ),
        ]

    klass_dict = {"__module__": klass.__module__, "Meta": Meta}
    tag_class = track_events(app_label=klass._meta.app_label)(type(klass_name, bases, klass_dict))  # NOQA
    return tag_class


class TagMaker:
    def __init__(self, **kwargs):
        self.related_name = kwargs.get("related_name")
        self.tag_class_attribute_name = kwargs.get("tag_class_attribute_name")
        self.tag_through_class_attribute_name = kwargs.get("tag_through_class_attribute_name")

    def contribute_to_class(self, cls, name):
        tag_class, tag_object_class = create_tag_class(cls), create_object_tag_class(cls, name)
        setattr(cls, self.tag_class_attribute_name, tag_class)
        setattr(cls, self.tag_through_class_attribute_name, tag_object_class)
        m2m_field = models.ManyToManyField(
            tag_class, through=tag_object_class, blank=True, related_name=self.related_name
        )
        m2m_field.contribute_to_class(cls, name)


def tags(related_name, tag_class_attribute_name="tag_class", tag_through_class_attribute_name="tag_through_class"):
    tag_maker = TagMaker(
        related_name=related_name,
        tag_class_attribute_name=tag_class_attribute_name,
        tag_through_class_attribute_name=tag_through_class_attribute_name,
    )
    return tag_maker
