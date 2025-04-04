from contextlib import contextmanager
from uuid import UUID, uuid4

from django.db import models, transaction
from django.utils.translation import gettext as _
from django_lifecycle import (
    AFTER_CREATE,
    AFTER_SAVE,
    AFTER_UPDATE,
    BEFORE_CREATE,
    BEFORE_SAVE,
    BEFORE_UPDATE,
    LifecycleModelMixin,
    hook,
)


class BaseModel(LifecycleModelMixin, models.Model):
    STR = None
    REPR = "{self.__class__.__name__}(id={self.id})"
    FIELDS = ["id", "slug", "created_at", "updated_at"]

    _skip_full_clean = False

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

    @transaction.atomic
    def save(self, *args, **kwargs):
        skip_hooks = kwargs.pop("skip_hooks", False)
        save = super().save

        if skip_hooks:
            save(*args, **kwargs)
            return

        self._clear_watched_fk_model_cache()
        is_new = self._state.adding

        if is_new:
            self._run_hooked_methods(BEFORE_CREATE, **kwargs)
        else:
            self._run_hooked_methods(BEFORE_UPDATE, **kwargs)

        self._run_hooked_methods(BEFORE_SAVE, **kwargs)
        if not self._skip_full_clean:
            self.full_clean()
        save(*args, **kwargs)
        self._run_hooked_methods(AFTER_SAVE, **kwargs)

        if is_new:
            self._run_hooked_methods(AFTER_CREATE, **kwargs)
        else:
            self._run_hooked_methods(AFTER_UPDATE, **kwargs)

        transaction.on_commit(self._reset_initial_state)

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

    def as_queryset(self):
        return self.__class__.objects.filter(id=self.id)

    @contextmanager
    def skip_full_clean(self):
        original_value = self._skip_full_clean
        self._skip_full_clean = True
        try:
            yield
        finally:
            self._skip_full_clean = original_value

    @contextmanager
    def skip_field_validators(self, *field_names):
        original_validators = {}
        for field_name in field_names:
            field = self._meta.get_field(field_name)
            original_validators[field_name] = field.validators
            field.validators = []
        try:
            yield
        finally:
            for field_name, validators in original_validators.items():
                field = self._meta.get_field(field_name)
                field.validators = validators

    __repr__ = __default_repr
    __str__ = __default_str

    class Meta:
        abstract = True
