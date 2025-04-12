from functools import reduce

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import Q


class AutoGenericForeignKey(GenericForeignKey):
    def __init__(self, *args, **kwargs):
        self.limit_models_to = kwargs.pop("limit_models_to", None)
        self.ct_field_name = None
        self.fk_field_name = None
        super().__init__(*args, **kwargs)

    @property
    def limit_gfk_models_to(self):
        if self.limit_models_to:
            q_objects = [
                (
                    Q(app_label=model._meta.app_label, model=model._meta.model_name)
                    if isinstance(model, type)
                    else Q(app_label=model.split(".")[0], model=model.split(".")[1])
                )
                for model in self.limit_models_to
            ]

            return reduce(lambda x, y: x | y, q_objects) if q_objects else None

        return None

    def contribute_to_class(self, cls, name, **kwargs):
        self.name = name

        self.ct_field_name = f"{name}_content_type"
        self.fk_field_name = f"{name}_object_id"

        content_type_field = models.ForeignKey(
            ContentType,
            related_name=f"{cls.__name__.lower()}_{name}+",
            on_delete=models.CASCADE,
            db_index=True,
            limit_choices_to=self.limit_gfk_models_to,
        )
        content_type_field.contribute_to_class(cls, self.ct_field_name)

        object_id_field = models.UUIDField(db_index=True)
        object_id_field.contribute_to_class(cls, self.fk_field_name)

        self.ct_field = self.ct_field_name
        self.fk_field = self.fk_field_name

        super().contribute_to_class(cls, name)
