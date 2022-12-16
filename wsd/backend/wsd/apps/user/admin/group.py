from django.contrib import admin
from django.contrib.auth.models import Group

admin.site.unregister(Group)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_fields = ["name"]
    search_fields = ["name"]
    autocomplete_fields = ["permissions"]
