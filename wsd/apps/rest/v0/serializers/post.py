from apps.core.models import Post
from rest_framework import serializers

from .base import BaseModelSerializer, s


class PostSerializer(BaseModelSerializer):
    positive_vote_count = serializers.IntegerField()
    negative_vote_count = serializers.IntegerField()

    class Meta:
        model = Post
        fields = [
            "id",
            "created_at",
            "updated_at",
            "title",
            "image",
            "tags",
            "positive_vote_count",
            "negative_vote_count",
        ]
        relational_fields = {
            "tags": s("PostTagSerializer"),
        }
