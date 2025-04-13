from apps.core.models import Notification
from apps.rest.utils.permissions import IsAuthenticatedANDSignupCompleted, IsSuperUser, ReadOnly, is_owner
from apps.rest.v0.serializers import NotificationSerializer

from .base import BaseModelViewSet


class NotificationViewSet(BaseModelViewSet):
    endpoint = "notifications"
    model = Notification
    serializer_class = NotificationSerializer
    disallowed_methods = ["create", "destroy"]
    permission_classes = [IsSuperUser | (IsAuthenticatedANDSignupCompleted & is_owner("user")) | ReadOnly]
    filterset_fields = {
        "is_read": ["exact"],
        "event": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)
