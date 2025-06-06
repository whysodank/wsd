from apps.core.models import Post, PostBookmark, PostVote
from apps.rest.utils.filters import make_filters
from apps.rest.utils.permissions import (
    IsAuthenticatedANDSignupCompleted,
    IsSuperUser,
    ReadOnly,
    is_owner,
    prevent_actions,
)
from apps.rest.utils.schema_helpers import fake_serializer
from apps.rest.v0.serializers import PostSerializer
from django.db.models import BooleanField, Count, Exists, IntegerField, OuterRef, Q, Subquery, Value
from django.utils import timezone
from django_filters import BooleanFilter, ChoiceFilter, NumberFilter
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response

from .base import BaseModelViewSet, django_to_drf_validation_error


class PostViewSet(BaseModelViewSet):
    endpoint = "posts"
    model = Post
    serializer_class = PostSerializer
    disallowed_methods = ["update", "partial_update"]

    permission_classes = [
        IsSuperUser
        | (
            IsAuthenticatedANDSignupCompleted
            & (is_owner("user") | prevent_actions("update", "partial_update", "destroy"))
        )
        | ReadOnly
    ]

    declared_filters = {
        "vote": ChoiceFilter(choices=PostVote.VoteType.choices),
        "vote__isnull": BooleanFilter(field_name="vote", lookup_expr="isnull"),
        "bookmarked": BooleanFilter(field_name="bookmarked"),
        **make_filters("positive_vote_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("negative_vote_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("comment_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    filterset_fields = {
        "user": ["exact"],
        "user__username": ["exact"],
        "title": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
        "tags": ["exact", "isnull"],
        "category": ["exact", "isnull"],
        "category__handle": ["exact"],
        "is_repost": ["exact"],
        "is_nsfw": ["exact"],
        "is_original": ["exact"],
        "is_removed": ["exact"],
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
            comment_count=Count("comments", distinct=True),
        )
        qs = self.annotate_vote(qs, self.request)
        qs = self.annotate_bookmarked(qs, self.request)
        qs = qs.prefetch_related("user", "tags", "category")
        # Filter based on user permissions
        qs = qs.for_user(self.request.user)
        return qs

    @staticmethod
    def annotate_vote(queryset, request):
        queryset = queryset.annotate(vote=Value(0, output_field=IntegerField(null=True)))
        if request and request.user and request.user.is_authenticated:
            user_vote = PostVote.objects.filter(post=OuterRef("pk"), user=request.user).values("body")[:1]
            queryset = queryset.annotate(vote=Subquery(user_vote, output_field=IntegerField(null=True)))
        return queryset

    @staticmethod
    def annotate_bookmarked(queryset, request):
        queryset = queryset.annotate(bookmarked=Value(False, output_field=BooleanField()))
        if request and request.user and request.user.is_authenticated:
            user_bookmark = PostBookmark.objects.filter(post=OuterRef("pk"), user=request.user)
            queryset = queryset.annotate(bookmarked=Exists(user_bookmark))
        return queryset

    @django_to_drf_validation_error
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
        permission_classes=[IsAuthenticatedANDSignupCompleted],
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
        permission_classes=[IsAuthenticatedANDSignupCompleted],
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
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def unvote(self, *args, **kwargs):
        self.request.user.unvote(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Bookmark Post",
        description=f"Bookmark an post by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="bookmark",
        serializer_class=fake_serializer("BookmarkPost", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def bookmark(self, *args, **kwargs):
        self.request.user.bookmark(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Post Bookmark",
        description=f"Remove bookmark from post by id",
        responses={204: None, 401: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="unbookmark",
        serializer_class=fake_serializer("UnbookmarkPost", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted],
    )
    @django_to_drf_validation_error
    def unbookmark(self, *args, **kwargs):
        self.request.user.unbookmark(self.get_object())
        return Response(status=204)

    @extend_schema(
        summary=f"Remove Post",
        description=f"Mark a post as removed. Only the post creator or superusers can remove posts.",
        responses={204: None, 401: None, 403: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="remove",
        serializer_class=fake_serializer("RemovePost", dont_initialize=True),
        permission_classes=[IsAuthenticatedANDSignupCompleted & (is_owner("user") | IsSuperUser)],
    )
    @django_to_drf_validation_error
    def remove(self, *args, **kwargs):
        post = self.get_object()
        post.is_removed = True
        post.removed_at = timezone.now()
        post.save()
        return Response(status=204)

    @extend_schema(
        summary=f"Unremove Post",
        description=f"Mark a removed post as not removed. Only superusers can unremove posts.",
        responses={204: None, 401: None, 403: None},
    )
    @action(
        detail=True,
        methods=["POST"],
        url_path="unremove",
        serializer_class=fake_serializer("UnremovePost", dont_initialize=True),
        permission_classes=[IsSuperUser],
    )
    @django_to_drf_validation_error
    def unremove(self, *args, **kwargs):
        post = self.get_object()
        post.is_removed = False
        post.removed_at = None
        post.save()
        return Response(status=204)
