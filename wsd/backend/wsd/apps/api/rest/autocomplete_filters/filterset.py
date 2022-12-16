from django.db import models
from django_filters.rest_framework.filters import ModelChoiceFilter, ModelMultipleChoiceFilter
from django_filters.rest_framework.filterset import FilterSet

from .widgets import AutocompleteSelect, AutocompleteSelectMultiple


class AutoCompleteFilterSet(FilterSet):
    m2m_or_fk_related_lookups = ["exact"]

    @classmethod
    def filter_for_field(cls, field, field_name, lookup_expr=None):
        if isinstance(field, models.ForeignKey) and lookup_expr in cls.m2m_or_fk_related_lookups:
            filter_ = cls.filter_for_foreignkey(field, field_name)
        elif isinstance(field, models.ManyToManyField) and lookup_expr in cls.m2m_or_fk_related_lookups:
            filter_ = cls.filter_for_manytomany(field, field_name)
        else:
            filter_ = super().filter_for_field(field, field_name, lookup_expr)
        return filter_

    @classmethod
    def filter_for_foreignkey(cls, field, field_name):
        class AutocompleteModelChoiceFilter(ModelChoiceFilter):
            @property
            def field(self):
                return field.formfield(widget=AutocompleteSelect(db_field=field), required=False)

        return AutocompleteModelChoiceFilter(field_name=field_name)

    @classmethod
    def filter_for_manytomany(cls, field, field_name):
        class AutocompleteModelMultipleChoiceFilter(ModelMultipleChoiceFilter):
            @property
            def field(self):
                return field.formfield(widget=AutocompleteSelectMultiple(db_field=field), required=False)

        return AutocompleteModelMultipleChoiceFilter(field_name=field_name)
