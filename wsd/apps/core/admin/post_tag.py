from apps.common.admin.base import BaseAdmin
from apps.core.models import PostTag
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


@admin.register(PostTag)
class PostTagAdmin(BaseAdmin):
    search_fields = ["name"]
    list_display = ["name"]
    object_fieldsets = [
        [["name"], _("Name")],
    ]
