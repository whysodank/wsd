from apps.core.models import Post
from rest_framework import serializers

from .base import BaseModelSerializer


class PostSerializer(BaseModelSerializer):
    force_current_user_fields = ["user"]
    upvote_count = serializers.SerializerMethodField(source="get_upvote_count")
    downvote_count = serializers.SerializerMethodField(source="get_downvote_count")
    tags = serializers.SerializerMethodField(source="get_tags")

    class Meta:
        model = Post
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "title",
            "image",
            "comments",
            "initial",
            "is_repost",
            "original_source",
            "upvote_count",
            "downvote_count",
            "tags",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "comments",
            "initial",
            "is_repost",
            "original_source",
            "user",
            "upvote_count",
            "downvote_count",
            "tags",
        ]

    @staticmethod
    def get_upvote_count(instance):
        return instance.votes.filter(body=instance.vote_class.VoteType.UPVOTE).count()

    @staticmethod
    def get_downvote_count(instance):
        return instance.votes.filter(body=instance.vote_class.VoteType.DOWNVOTE).count()

    @staticmethod
    def get_tags(instance):
        return list(instance.tags.all().values_list("name", flat=True))
