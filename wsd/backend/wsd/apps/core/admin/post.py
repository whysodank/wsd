from django.contrib import admin

from apps.common.admin.base import BaseAdmin
from apps.core.models import Post


@admin.register(Post)
class PostAdmin(BaseAdmin):
    update_readonly_fields = Post.HASH_FIELDS + Post.EXTRACTED_TEXT_FIELDS
    search_fields = ["title"]
    autocomplete_fields = ["user", "initial", "tags"]
    autocomplete_list_filter = ["user", "initial", "tags"]
    list_filter = ["is_repost"]
    list_display = ["title", "user"]
    object_fieldsets = [
        [["user", "title", "image", "original_source", "tags"], "Post"],
    ]
    meta_fieldsets = [
        [["initial", "is_repost"], "Informational"],
        [Post.HASH_FIELDS, "Post"],
        [Post.EXTRACTED_TEXT_FIELDS, "Text"],
    ]
    safe_m2m_fields = ["tags"]
