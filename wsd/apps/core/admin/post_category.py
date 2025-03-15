from apps.common.admin.base import BaseAdmin
from apps.core.models import PostCategory
from django.contrib import admin
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _


@admin.register(PostCategory)
class PostCategoryAdmin(BaseAdmin):
    search_fields = ["name", "handle"]
    list_display = ["name", "handle"]
    object_fieldsets = [[["name", "handle"], _("Category")], [["icon", "icon_display"], _("Icon")]]
    global_readonly_fields = ["icon_display"]

    @admin.display(description="Icon Display")
    def icon_display(self, obj):
        return mark_safe(obj.icon)
