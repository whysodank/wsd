from django_filters.rest_framework.backends import DjangoFilterBackend

from .filterset import AutoCompleteFilterSet


class AutocompleteFilterBackend(DjangoFilterBackend):
    filterset_base = AutoCompleteFilterSet
