from apps.core.models import PostComment, PostCommentVote
from rest_framework import serializers

from .base import BaseModelSerializer, s


class PostCommentSerializer(BaseModelSerializer):
    vote = serializers.ChoiceField(
        choices=PostCommentVote.VoteType.choices,
        required=False,
        read_only=True,
        allow_null=True,
    )
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

    class Meta:
        model = PostComment
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "post",
            "body",
            "vote",
            "positive_vote_count",
            "negative_vote_count",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
            "vote",
            "positive_vote_count",
            "negative_vote_count",
        ]
        relational_fields = {
            "user": s("PublicUserSerializer")(),
        }
