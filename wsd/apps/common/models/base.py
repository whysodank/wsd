from uuid import UUID, uuid4

from django.db import models
from django.utils.translation import gettext_lazy as _
from django_lifecycle import BEFORE_CREATE, LifecycleModel, hook


class BaseModel(LifecycleModel):
    STR = None
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
        self.slug = self._uuid_to_hex(self.id)

    @staticmethod
    def _uuid_to_hex(value):
        return str(value.hex)

    @staticmethod
    def _hex_to_uuid(slug):
        return UUID(int=int(slug, 16))

    @classmethod
    def get_from_hex(cls, hex):  # NOQA
        return cls.objects.get(id=cls._hex_to_uuid(hex))

    @property
    def hex(self):
        return self._uuid_to_hex(self.id)

    def __default_repr(self):
        return self.REPR.format(self=self)

    def __default_str(self):
        return self.STR.format(self=self) if self.STR else self.__default_repr()

    def update(self, **kwargs):
        skip_hooks = kwargs.pop("_skip_hooks", False)
        for key, val in kwargs.items():
            setattr(self, key, val)
        return self.save(skip_hooks=skip_hooks, update_fields=kwargs.keys())

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def as_queryset(self):
        return self.__class__.objects.filter(id=self.id)

    __repr__ = __default_repr
    __str__ = __default_str

    class Meta:
        abstract = True
