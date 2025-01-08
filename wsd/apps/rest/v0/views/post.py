from apps.core.models import Post
from apps.rest.v0.serializers import PostSerializer
from django.db.models import Count, Q

from .base import BaseModelViewSet


class PostViewSet(BaseModelViewSet):
    endpoint = "posts"
    model = Post
    serializer_class = PostSerializer

    def get_queryset(self):
        qs = Post.objects.annotate(
            positive_vote_count=Count("votes", filter=Q(votes__body=Post.vote_class.VoteType.UPVOTE)),
            negative_vote_count=Count("votes", filter=Q(votes__body=Post.vote_class.VoteType.DOWNVOTE)),
        )
        return qs
