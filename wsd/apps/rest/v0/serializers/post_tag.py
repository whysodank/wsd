from apps.core.models import PostTag
from rest_framework import serializers

from .base import BaseModelSerializer


class PostTagSerializer(BaseModelSerializer):
    name = serializers.CharField(max_length=PostTag.name.field.max_length)

    class Meta:
        model = PostTag
        fields = ["id", "created_at", "updated_at", "name"]
