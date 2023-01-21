from apps.rest.v1.serializers import OriginalSourceClaimSerializer

from .base import BaseModelViewSet


class OriginalSourceClaimViewSet(BaseModelViewSet):
    endpoint = "original_source_claims"
    serializer_class = OriginalSourceClaimSerializer
    filterset_fields = {
        "id": ["exact"],
        "created_at": ["exact", "lt", "lte", "gt", "gte"],
        "updated_at": ["exact", "lt", "lte", "gt", "gte"],
        "user": ["exact"],
        "post": ["exact"],
    }
    search_fields = ["id"]
