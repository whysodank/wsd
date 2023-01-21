from apps.core.models import OriginalSourceClaim

from .base import BaseModelSerializer


class OriginalSourceClaimSerializer(BaseModelSerializer):
    force_current_user_fields = ["user"]

    class Meta:
        model = OriginalSourceClaim
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user",
            "post",
            "source",
            "comment",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "user",
            "post" "status",
        ]
