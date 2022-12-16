from base64 import urlsafe_b64decode, urlsafe_b64encode
from django.db import models
from django.utils.translation import gettext_lazy as _
from django_lifecycle import BEFORE_CREATE, LifecycleModel, hook
from uuid import UUID, uuid4


class Base(LifecycleModel):
    REPR = "{self.__class__.__name__}(id={self.id})"
    FIELDS = ["id", "slug", "created_at", "updated_at"]

    id = models.UUIDField(primary_key=True, db_index=True, editable=False, default=uuid4, verbose_name=_("ID"))
    slug = models.SlugField(db_index=True, null=True, blank=True, verbose_name=_("Slug"))
    created_at = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, db_index=True, verbose_name=_("Updated At"))

    @hook(BEFORE_CREATE)
    def create_slug_from_id(self):
        # This will be the unique url slug, not completely human readable but it is globally unique
        # We would preferably switch this guy into a generated field in postgres as soon as django supports it
        # instead of writing this inside a hook on application logic
        self.slug = self._uuid2slug(self.id)

    @staticmethod
    def _uuid2slug(uuid):
        return urlsafe_b64encode(uuid.bytes).rstrip(b"=").decode("ascii")

    @staticmethod
    def _slug2uuid(slug):
        return UUID(bytes=urlsafe_b64decode(slug + "=="))

    def __default_repr(self):
        return self.REPR.format(self=self)

    def update(self, **kwargs):
        skip_hooks = kwargs.pop("_skip_hooks", False)
        for key, val in kwargs.items():
            setattr(self, key, val)
        return self.save(skip_hooks=skip_hooks, update_fields=kwargs.keys())

    __repr__ = __str__ = __default_repr

    class Meta:
        abstract = True
