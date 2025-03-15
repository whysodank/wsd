from apps.core.models import Post, PostVote
from apps.tags.drf import create_tag_serializer
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from .base import BaseModelSerializer, s


class PostSerializer(BaseModelSerializer):
    image = Base64ImageField(help_text=f"Image({', '.join(Base64ImageField.ALLOWED_TYPES)}) in base64 format")
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
    tags = create_tag_serializer(Post.tag_class)

    class Meta:
        model = Post
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "title",
            "image",
            "category",
            "tags",
            "vote",
            "positive_vote_count",
            "negative_vote_count",
            "comment_count",
        ]
        read_only_fields = [
            "id",
            "user",
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
            "category": s("PostCategorySerializer")(),
        }
