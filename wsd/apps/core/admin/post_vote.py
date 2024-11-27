from apps.common.admin.base import BaseAdmin
from apps.core.models import PostVote
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


@admin.register(PostVote)
class PostVoteAdmin(BaseAdmin):
    autocomplete_fields = ["user", "post"]
    autocomplete_list_filter = ["user", "post"]
    list_display = ["user", "post", "body"]
    object_fieldsets = [[["user", "post", "body"], _("Vote")]]
