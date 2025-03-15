from apps.common.admin.base import BaseAdmin
from apps.core.models import PostComment
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


@admin.register(PostComment)
class PostCommentAdmin(BaseAdmin):
    search_fields = ["body"]
    autocomplete_fields = ["user", "post"]
    autocomplete_list_filter = ["user", "post"]
    list_display = ["user", "post"]
    object_fieldsets = [[["user", "post", "body"], _("Comment")]]
    create_force_field_as_current_user = ["user"]
    update_readonly_fields = ["body", "post"]
    global_readonly_fields = ["user"]
