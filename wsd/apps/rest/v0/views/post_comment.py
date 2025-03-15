from apps.core.models import PostComment, PostCommentVote
from apps.rest.utils.filters import make_filters
from apps.rest.utils.permissions import IsSuperUser, ReadOnly, is_owner, prevent_actions
from apps.rest.utils.schema_helpers import fake_serializer
from apps.rest.v0.serializers import PostCommentSerializer
from django.db.models import CharField, Count, OuterRef, Q, Subquery, Value
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .base import BaseModelViewSet, django_to_drf_validation_error


class PostCommentViewSet(BaseModelViewSet):
    endpoint = "post-comments"
    model = PostComment
    serializer_class = PostCommentSerializer
    create_no_update_fields = ["post"]

    permission_classes = [
        IsSuperUser
        | (IsAuthenticated & (is_owner("user") | prevent_actions("update", "partial_update", "destroy")))
        | ReadOnly
    ]

    declared_filters = {
        **make_filters("positive_vote_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("negative_vote_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    filterset_fields = {
        "user": ["exact"],
        "post": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    ordering_fields = [
        "created_at",
        "updated_at",
        "positive_vote_count",
        "negative_vote_count",
    ]

    update_schema = fake_serializer(
        name="PostCommentUpdateSerializer",
        base=PostCommentSerializer,
        remove_fields=["post"],
    )

    crud_extend_default_schema = {
        "update": {"request": update_schema},
        "partial_update": {"request": update_schema},
    }

    def get_queryset(self):
        qs = PostComment.objects.annotate(
            positive_vote_count=Count("votes", filter=Q(votes__body=PostCommentVote.VoteType.UPVOTE)),
            negative_vote_count=Count("votes", filter=Q(votes__body=PostCommentVote.VoteType.DOWNVOTE)),
        )
        qs = self.annotate_votes(qs, self.request)
        return qs

    @staticmethod
    def annotate_votes(queryset, request):
        queryset = queryset.annotate(vote=Value(None, output_field=CharField(null=True)))
        if request and request.user and request.user.is_authenticated:
            user_vote = PostCommentVote.objects.filter(post=OuterRef("pk"), user=request.user).values("body")[:1]
            queryset = queryset.annotate(vote=Subquery(user_vote, output_field=CharField(null=True)))
        return queryset

    @django_to_drf_validation_error
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @extend_schema(
        summary=f"Upvote Post Comment",
        description=f"Cast a down vote to a post comment by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="upvote",
        serializer_class=fake_serializer("UpvotePostComment", dont_initialize=True),
        permission_classes=[IsAuthenticated],
    )
    @django_to_drf_validation_error
    def upvote(self, *args, **kwargs):
        self.request.user.upvote(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Downvote Post Comment",
        description=f"Cast an up vote to a post comment by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="downvote",
        serializer_class=fake_serializer("DownvotePostComment", dont_initialize=True),
        permission_classes=[IsAuthenticated],
    )
    @django_to_drf_validation_error
    def downvote(self, *args, **kwargs):
        self.request.user.downvote(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Post Comment Vote",
        description=f"Remove vote from post comment by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="unvote",
        serializer_class=fake_serializer("UnvotePostComment", dont_initialize=True),
        permission_classes=[IsAuthenticated],
    )
    @django_to_drf_validation_error
    def unvote(self, *args, **kwargs):
        self.request.user.unvote(self.get_object())
        return Response(status=204)
