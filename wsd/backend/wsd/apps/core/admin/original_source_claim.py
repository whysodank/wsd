from django.contrib import admin

from apps.common.admin import BaseAdmin
from apps.common.utils import action
from apps.core.models import OriginalSourceClaim


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
        [["user", "post", "source", "comment", "status", "contact_information"], "Original Source Claim"],
    ]

    @action(description="Approve claim and set post original source to claim source")
    def approve(self, request, queryset):
        for claim in queryset:
            claim.approve()

    @action(description="Reject the original source claim")
    def reject(self, request, queryset):
        for claim in queryset:
            claim.reject()
