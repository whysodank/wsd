from apps.core.models import PostTag
from apps.rest.v0.serializers import PostTagSerializer

from .base import BaseModelViewSet


class PostTagViewSet(BaseModelViewSet):
    endpoint = "post-tags"
    model = PostTag
    serializer_class = PostTagSerializer
    disallowed_methods = ["create", "update", "partial_update", "destroy"]
