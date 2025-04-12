from apps.core.models import Notification
from apps.rest.v0.serializers import NotificationSerializer

from .base import BaseModelViewSet


class NotificationViewSet(BaseModelViewSet):
    endpoint = "notifications"
    model = Notification
    serializer_class = NotificationSerializer
    disallowed_methods = ["create", "update", "destroy"]
    filterset_fields = {
        "is_read": ["exact"],
        "event": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)
