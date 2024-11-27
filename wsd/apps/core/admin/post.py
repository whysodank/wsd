from apps.common.admin.base import BaseAdmin
from apps.core.models import Post
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


@admin.register(Post)
class PostAdmin(BaseAdmin):
    update_readonly_fields = Post.HASH_FIELDS + Post.EXTRACTED_TEXT_FIELDS
    search_fields = ["title"]
    autocomplete_fields = ["user", "initial", "tags"]
    autocomplete_list_filter = ["user", "initial", "tags"]
    list_filter = ["is_repost"]
    list_display = ["title", "user"]
    object_fieldsets = [
        [["user", "title", "image", "original_source", "tags"], _("Post")],
    ]
    meta_fieldsets = [
        [["initial", "is_repost"], _("Informational")],
        [Post.HASH_FIELDS, _("Post")],
        [Post.EXTRACTED_TEXT_FIELDS, _("Text")],
    ]
    safe_m2m_fields = ["tags"]
