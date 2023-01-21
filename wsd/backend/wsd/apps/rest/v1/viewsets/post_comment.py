from apps.rest.v1.serializers import PostCommentSerializer
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from .base import BaseModelViewSet


class PostCommentViewSet(BaseModelViewSet):
    endpoint = "post_comments"
    serializer_class = PostCommentSerializer
    filterset_fields = {
        "id": ["exact"],
        "created_at": ["exact", "lt", "lte", "gt", "gte"],
        "updated_at": ["exact", "lt", "lte", "gt", "gte"],
        "user": ["exact"],
        "body": ["exact", "icontains"],
        "post": ["exact"],
    }
    search_fields = ["id", "body"]

    @action(detail=True, methods=["post"])
    def upvote(self, request, pk=None):
        post_comment = self.get_object()
        request.user.upvote(post_comment)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def downvote(self, request, pk=None):
        post_comment = self.get_object()
        request.user.downvote(post_comment)
        return Response(status=status.HTTP_200_OK)
