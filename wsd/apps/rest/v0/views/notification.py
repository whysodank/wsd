from apps.core.models import Notification
from apps.rest.utils.permissions import IsAuthenticatedANDSignupCompleted, IsSuperUser, is_owner
from apps.rest.v0.serializers import NotificationSerializer
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from .base import BaseModelViewSet


class NotificationViewSet(BaseModelViewSet):
    endpoint = "notifications"
    model = Notification
    serializer_class = NotificationSerializer
    disallowed_methods = ["create", "destroy"]
    permission_classes = [IsSuperUser | (IsAuthenticatedANDSignupCompleted & is_owner("user"))]
    filterset_fields = {
        "is_read": ["exact"],
        "event": ["exact"],
        "created_at": ["exact", "gt", "gte", "lt", "lte"],
        "updated_at": ["exact", "gt", "gte", "lt", "lte"],
    }

    def get_queryset(self):
        user = self.request.user
        return self.model.objects.filter(user=user) if user.is_authenticated else self.model.objects.none()

    @extend_schema(
        summary="Mark all notifications as read",
        description="Marks all notifications for the current user as read",
        responses={
            200: {"type": "object", "properties": {"message": {"type": "string"}}},
            401: None,
            403: {"type": "object", "properties": {"detail": {"type": "string"}}},
        },
    )
    @action(detail=False, methods=["post"])
    def mark_all_as_read(self, request):
        """Mark all notifications as read for the current user."""
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED
            )

        # Get all unread notifications for the user
        notifications = self.get_queryset().filter(is_read=False)

        # Update all notifications to mark them as read
        count = notifications.update(is_read=True)

        return Response({"message": f"Successfully marked {count} notifications as read."}, status=status.HTTP_200_OK)
