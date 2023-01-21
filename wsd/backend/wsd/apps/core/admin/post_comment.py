from apps.common.admin.base import BaseAdmin
from apps.core.models import PostComment
from django.contrib import admin


@admin.register(PostComment)
class PostCommentAdmin(BaseAdmin):
    search_fields = ["body"]
    autocomplete_fields = ["user", "post"]
    autocomplete_list_filter = ["user", "post"]
    list_display = ["user", "post"]
    object_fieldsets = [[["user", "post", "body"], "Comment"]]
