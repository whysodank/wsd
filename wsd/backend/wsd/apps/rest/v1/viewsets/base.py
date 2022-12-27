from django.utils.functional import classproperty
from django_filters.rest_framework import FilterSet
from rest_framework.viewsets import ModelViewSet


class BaseModelViewSet(ModelViewSet):
    endpoint = None
    namespace = None
    filterset_fields = {}
    declared_filters = {}
    filterset_base = FilterSet
    prefetch_related = []
    select_related = []

    @classproperty
    def ordering_fields(cls):
        return list(cls.filterset_fields.keys())

    @classproperty
    def search_fields(cls):
        return [cls.serializer_class.Meta.model._meta.pk.name]  # NOQA

    def get_queryset(self):
        qs = self.serializer_class.Meta.model.objects.all()
        qs = qs.prefetch_related(*self.prefetch_related).select_related(*self.select_related)
        return qs

    @classproperty
    def filterset_class(cls):
        meta_base = getattr(cls.filterset_base, "Meta", object)
        meta_dict = {"model": cls.serializer_class.Meta.model, "fields": cls.filterset_fields}
        meta = type("Meta", (meta_base,), meta_dict)
        filterset = type("AutoFilterSet", (cls.filterset_base,), {**cls.declared_filters, "Meta": meta})
        return filterset

    def perform_create(self, serializer):
        serializer_class = self.get_serializer_class()
        force_current_user_fields = {field: self.request.user for field in serializer_class.force_current_user_fields}
        serializer.save(**force_current_user_fields)

    def __init_subclass__(cls, **kwargs):
        cls.model = cls.serializer_class.Meta.model
