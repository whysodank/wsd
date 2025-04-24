from apps.user.models import User
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from more_admin_filters import BooleanAnnotationFilter


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "is_staff", "is_superuser", "date_joined", "created_at", "updated_at"]
    autocomplete_fields = [
        "groups",
        "user_permissions",
    ]
    readonly_fields = [
        "date_joined",
        "last_login",
    ]
    list_filter = [
        "is_staff",
        "is_active",
        "is_superuser",
        "created_at",
        "updated_at",
        BooleanAnnotationFilter.init(User.SIGNUP_COMPLETED_FIELD),
    ]
