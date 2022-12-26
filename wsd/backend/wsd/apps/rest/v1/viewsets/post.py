from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.core.models import UserPostView
from apps.rest.v1.serializers import PostSerializer
from .base import BaseModelViewSet


class PostViewSet(BaseModelViewSet):
    endpoint = "posts"
    serializer_class = PostSerializer
    filterset_fields = {
        "id": ["exact"],
        "created_at": ["exact", "lt", "lte", "gt", "gte"],
        "updated_at": ["exact", "lt", "lte", "gt", "gte"],
        "user": ["exact"],
        "title": ["exact", "icontains"],
        "initial": ["exact"],
        "is_repost": ["exact"],
        "original_source": ["exact", "icontains"],
    }
    search_fields = ["id", "title"]

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        UserPostView.mark_posts_viewed_by_user(qs, self.current_user)
        return qs

    def get_object(self):
        obj = super().get_object()
        UserPostView.mark_post_viewed_by_user(obj, self.current_user)
        return obj

    @property
    def current_user(self):
        user = self.request.user
        return None if user.is_anonymous else user

    @action(detail=True, methods=["post"])
    def upvote(self, request, pk=None):
        post = self.get_object()
        request.user.upvote(post)
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def downvote(self, request, pk=None):
        post = self.get_object()
        request.user.downvote(post)
        return Response(status=status.HTTP_200_OK)
