from apps.core.models import PostTag

from .base import BaseModelSerializer


class PostTagSerializer(BaseModelSerializer):
    class Meta:
        model = PostTag
        fields = ["id", "created_at", "updated_at", "name"]
