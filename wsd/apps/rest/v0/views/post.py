from apps.core.models import Post, PostVote
from apps.rest.utils.filters import make_filters
from apps.rest.utils.permissions import IsSuperUser, ReadOnly, is_owner, prevent_actions
from apps.rest.utils.schema_helpers import fake_serializer
from apps.rest.v0.serializers import PostSerializer
from django.db.models import Count, IntegerField, OuterRef, Q, Subquery, Value
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .base import BaseModelViewSet, django_to_drf_validation_error


class PostViewSet(BaseModelViewSet):
    endpoint = "posts"
    model = Post
    serializer_class = PostSerializer

    permission_classes = [
        IsSuperUser
        | (IsAuthenticated & (is_owner("user") | prevent_actions("update", "partial_update", "destroy")))
        | ReadOnly
    ]

    declared_filters = {
        # "vote": ChoiceFilter(choices=PostVote.VoteType.choices),
        # "vote__isnull": BooleanFilter(field_name="vote", lookup_expr="isnull"),
        **make_filters("positive_vote_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("negative_vote_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("comment_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    filterset_fields = {
        "user": ["exact"],
        "title": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    ordering_fields = [
        "created_at",
        "updated_at",
        "positive_vote_count",
        "negative_vote_count",
        "comment_count",
    ]

    def get_queryset(self):
        qs = Post.objects.annotate(
            positive_vote_count=Count("votes", filter=Q(votes__body=PostVote.VoteType.UPVOTE), distinct=True),
            negative_vote_count=Count("votes", filter=Q(votes__body=PostVote.VoteType.DOWNVOTE), distinct=True),
            comment_count=Count("comments"),
        )
        qs = self.annotate_vote(qs, self.request)
        return qs

    @staticmethod
    def annotate_vote(queryset, request):
        queryset = queryset.annotate(vote=Value(0, output_field=IntegerField(null=True)))
        if request and request.user and request.user.is_authenticated:
            user_vote = PostVote.objects.filter(post=OuterRef("pk"), user=request.user).values("body")[:1]
            queryset = queryset.annotate(vote=Subquery(user_vote, output_field=IntegerField(null=True)))
        return queryset

    # @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        summary=f"Upvote Post",
        description=f"Cast a down vote to a post by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="upvote",
        serializer_class=fake_serializer("UpvotePost", dont_initialize=True),
        permission_classes=[IsAuthenticated],
    )
    @django_to_drf_validation_error
    def upvote(self, *args, **kwargs):
        self.request.user.upvote(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Downvote Post",
        description=f"Cast an up vote to a post by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="downvote",
        serializer_class=fake_serializer("DownvotePost", dont_initialize=True),
        permission_classes=[IsAuthenticated],
    )
    @django_to_drf_validation_error
    def downvote(self, *args, **kwargs):
        self.request.user.downvote(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Post Vote",
        description=f"Remove vote from post by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="unvote",
        serializer_class=fake_serializer("UnvotePost", dont_initialize=True),
        permission_classes=[IsAuthenticated],
    )
    @django_to_drf_validation_error
    def unvote(self, *args, **kwargs):
        self.request.user.unvote(self.get_object())
        return Response(status=204)
