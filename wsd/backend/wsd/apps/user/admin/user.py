from apps.user.models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    autocomplete_fields = [
        "groups",
        "user_permissions",
    ]
