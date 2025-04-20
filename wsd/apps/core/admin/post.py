from apps.common.admin.base import BaseAdmin
from apps.core.models import Post
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


@admin.register(Post)
class PostAdmin(BaseAdmin):
    update_readonly_fields = Post.HASH_FIELDS + Post.EXTRACTED_TEXT_FIELDS + ["image"]
    global_readonly_fields = ["user"]
    search_fields = ["title"]
    autocomplete_fields = ["user", "initial", "tags", "category"]
    autocomplete_list_filter = ["user", "initial", "category", "tags"]
    list_filter = ["is_original", "is_repost", "is_nsfw"]
    list_display = ["title", "user"]
    object_fieldsets = [
        [["user", "title", "image", "original_source", "category", "tags"], _("Post")],
    ]
    meta_fieldsets = [
        [["initial", "is_repost", "is_nsfw"], _("Informational")],
        [Post.HASH_FIELDS, _("Post")],
        [Post.EXTRACTED_TEXT_FIELDS, _("Text")],
    ]
    safe_m2m_fields = ["tags"]
    create_force_field_as_current_user = ["user"]
