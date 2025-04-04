from django.contrib.admin import action as action_
from django.db.transaction import atomic
from django_object_actions import takes_instance_or_queryset


def action(description):
    """
    ModelAdmin method decorator to mark a method as both list and detail action.
    """

    def decorator(func):
        return atomic(takes_instance_or_queryset(action_(description=description)(func)))

    return decorator
