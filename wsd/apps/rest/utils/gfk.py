from apps.common.utils import snake_to_pascal
from apps.rest.v0.serializers.base import BaseModelSerializer
from drf_spectacular.utils import PolymorphicProxySerializer
from generic_relations.relations import GenericRelatedField, GenericSerializerMixin
from rest_framework import serializers


class LazyGenericRelatedFieldTypes(serializers.ChoiceField):
    def __init__(self, choices_callback, *a, **kw):
        kw["choices"] = []
        kw["read_only"] = True
        kw["required"] = False
        self.choice_strings_to_values = {}
        super(LazyGenericRelatedFieldTypes, self).__init__(*a, **kw)
        self.choices_callback = choices_callback

    @property
    def choices(self):
        return dict(self.choices_callback())

    @choices.setter
    def choices(self, value):
        pass

    def get_attribute(self, instance):
        ct = getattr(instance, getattr(instance.__class__, self.source).ct_field_name)
        return ct.model_class().__name__


class LazyGenericRelatedField(GenericRelatedField):
    @property
    def _spectacular_annotation(self):
        annotation = {
            "field": PolymorphicProxySerializer(
                serializers={model.__name__: serializer for model, serializer in self.serializers.items()},
                resource_type_field_name=None,
                component_name=f"{self.parent.Meta.model.__name__}{snake_to_pascal(self.field_name)}",
            )
        }
        return annotation

    def __init__(self, serializers_func, *a, **kw):
        super(GenericSerializerMixin, self).__init__(*a, **kw)
        self.serializers_func = serializers_func

    @property
    def serializers(self):
        target_serializers = self.serializers_func()
        for key, serializer in target_serializers.items():
            new_context = self.context | getattr(serializer, "context", {})
            serializer._context = new_context
        return target_serializers


def get_generic_serializer_serializers(relation_models):
    def getter():
        _resource_serializers = BaseModelSerializer.model_serializer_map(*relation_models, ignore_missing=True)
        resource_serializers = {model: serializer() for model, serializer in _resource_serializers.items()}
        return resource_serializers

    return getter
