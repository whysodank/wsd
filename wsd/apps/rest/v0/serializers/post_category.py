from apps.core.models import PostCategory

from .base import BaseModelSerializer


class PostCategorySerializer(BaseModelSerializer):
    class Meta:
        model = PostCategory
        fields = [
            "id",
            "created_at",
            "updated_at",
            "name",
            "handle",
            "icon",
        ]
        read_only_fields = [
            "id",
            "user",
            "handle",
            "created_at",
            "updated_at",
            "name",
            "icon",
        ]
