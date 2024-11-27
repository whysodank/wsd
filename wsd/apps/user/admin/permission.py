from apps.common.utils import returns
from django.contrib import admin
from django.contrib.auth.models import Permission


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    search_fields = ["name", "codename"]
    autocomplete_filters = ["name", "codename"]
    readonly_fields = ["content_type", "name", "codename"]
    list_filter = ["content_type"]
    list_display = ["name", "codename", "content_type"]

    has_add_permission = returns(False)
    has_change_permission = returns(False)
