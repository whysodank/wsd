from apps.core.models import PostCategory
from apps.rest.utils.permissions import ReadOnly
from apps.rest.v0.serializers import PostCategorySerializer

from .base import BaseModelViewSet


class PostCategoryViewSet(BaseModelViewSet):
    endpoint = "post-categories"
    model = PostCategory
    serializer_class = PostCategorySerializer
    permission_classes = [ReadOnly]
    disallowed_methods = ["create", "update", "partial_update", "destroy"]
