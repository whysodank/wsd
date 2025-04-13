from apps.core.models import Notification
from apps.rest.utils.gfk import (
    LazyGenericRelatedField,
    LazyGenericRelatedFieldTypes,
    get_generic_serializer_serializers,
)

from .base import BaseModelSerializer

object_of_interest_serializers = get_generic_serializer_serializers(Notification.object_of_interest.limit_models_to)


class NotificationSerializer(BaseModelSerializer):
    object_of_interest = LazyGenericRelatedField(
        object_of_interest_serializers,
        read_only=True,
    )
    object_of_interest_type = LazyGenericRelatedFieldTypes(
        choices_callback=lambda: ((m.__name__, m.__name__) for m in object_of_interest_serializers()),
        source="object_of_interest",
    )

    class Meta:
        model = Notification
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "event",
            "description",
            "is_read",
            "object_of_interest",
            "object_of_interest_type",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "event",
            "description",
            "object_of_interest",
            "object_of_interest_type",
        ]
