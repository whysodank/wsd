from apps.common.admin import BaseAdmin
from apps.common.utils import action
from apps.core.models import OriginalSourceClaim
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


@admin.register(OriginalSourceClaim)
class OriginalSourceClaimAdmin(BaseAdmin):
    search_fields = ["comment"]
    autocomplete_fields = ["user", "post"]
    autocomplete_filters = ["user", "post"]
    actions = ["approve", "reject"]
    change_actions = ["approve", "reject"]
    list_display = ["user", "post", "source", "comment", "status"]
    autocomplete_list_filter = ["user", "post"]
    list_filter = ["status"]
    object_fieldsets = [
        [["user", "post", "source", "comment", "status"], _("Original Source Claim")],
    ]

    @action(description=_("Approve claim and set post original source to claim source"))
    def approve(self, request, queryset):
        for claim in queryset:
            claim.approve()

    @action(description=_("Reject the original source claim"))
    def reject(self, request, queryset):
        for claim in queryset:
            claim.reject()
