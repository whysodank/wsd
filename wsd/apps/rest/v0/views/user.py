from apps.rest.utils.filters import make_filters
from apps.rest.utils.schema_helpers import error_serializer
from apps.rest.v0.serializers import PublicUserSerializer, UserSerializer
from apps.user.models import User
from django.db.models import Count
from django_filters import NumberFilter
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action

from .base import BaseModelViewSet


class UserViewSet(BaseModelViewSet):
    endpoint = "users"
    model = User
    serializer_class = PublicUserSerializer

    serializer_class_action_map = {
        "me": UserSerializer,
        "patch_me": UserSerializer,
        "put_me": UserSerializer,
    }

    filterset_fields = {
        "username": ["iexact", "icontains"],
        "is_active": ["exact"],
        "is_staff": ["exact"],
        "is_superuser": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    declared_filters = {
        **make_filters("post_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
        **make_filters("post_comment_count", NumberFilter, ["exact", "gt", "gte", "lt", "lte"]),
    }

    disallowed_methods = ["create", "update", "partial_update", "destroy"]

    crud_extend_default_schema = {
        "list": {"responses": {200: PublicUserSerializer(many=True)}},
        "retrieve": {"responses": {200: PublicUserSerializer}},
    }

    def get_queryset(self):
        return User.objects.annotate(post_count=Count("posts"), post_comment_count=Count("post_comments"))

    @extend_schema(
        summary="Retrieve Me",
        description="Retrieve the current user",
        responses={
            200: UserSerializer,
        },
    )
    @action(detail=False, methods=["GET"], serializer_class=UserSerializer)
    def me(self, request):
        self.kwargs["pk"] = request.user.pk
        return super().retrieve(request)

    @extend_schema(
        summary="Patch Me",
        description="Partially update the current user",
        responses={200: UserSerializer, 400: error_serializer(UserSerializer)},
    )
    @me.mapping.patch
    def patch_me(self, request):
        self.kwargs["pk"] = request.user.pk
        self.kwargs["partial"] = True
        return BaseModelViewSet.update(self, request)

    @extend_schema(
        summary="Put Me",
        description="Update the current user",
        responses={200: UserSerializer, 400: error_serializer(UserSerializer)},
    )
    @me.mapping.put
    def put_me(self, request):
        self.kwargs["pk"] = request.user.pk
        return BaseModelViewSet.update(self, request)
