from apps.core.models import Post, PostVote
from rest_framework import serializers

from .base import BaseModelSerializer, s


class PostSerializer(BaseModelSerializer):
    vote = serializers.ChoiceField(choices=PostVote.VoteType.choices, required=False, read_only=True, allow_null=True)
    positive_vote_count = serializers.IntegerField(
        required=False,
        read_only=True,
        allow_null=True,
    )
    negative_vote_count = serializers.IntegerField(
        required=False,
        read_only=True,
        allow_null=True,
    )
    comment_count = serializers.IntegerField(
        required=False,
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "title",
            "image",
            "tags",
            "vote",
            "positive_vote_count",
            "negative_vote_count",
            "comment_count",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "vote",
            "positive_vote_count",
            "negative_vote_count",
            "comment_count",
        ]
        relational_fields = {
            "tags": s("PostTagSerializer")(many=True),
            "user": s("PublicUserSerializer")(),
        }
