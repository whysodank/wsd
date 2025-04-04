from apps.user.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .base import BaseModelSerializer


class PublicUserSerializer(BaseModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class UserSerializer(BaseModelSerializer):
    signup_completed = serializers.SerializerMethodField(required=False, read_only=True)

    def get_signup_completed(self, obj) -> str:
        return getattr(obj, self.Meta.model.SIGNUP_COMPLETED_FIELD, False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
            "signup_completed",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
            "signup_completed",
        ]


class UserCompleteSignupSerializer(UserSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {
            "username": {"required": True},
            "password": {
                "required": True,
                "write_only": True,
                "style": {"input_type": "password"},
                "validators": [validate_password],
            },
        }

    def save(self, user):
        user.username = self.validated_data.get("username", None)
        user.set_password(self.validated_data.pop("password", None))
        user.save()
