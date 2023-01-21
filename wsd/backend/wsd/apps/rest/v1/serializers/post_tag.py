from apps.core.models import PostTag
from apps.rest.validators import regex_validator
from apps.tags.tags import TAG_NAME_REGEX
from rest_framework import serializers

from .base import BaseModelSerializer


class PostTagSerializer(BaseModelSerializer):
    name = serializers.CharField(validators=[regex_validator(TAG_NAME_REGEX)])

    class Meta:
        model = PostTag
        fields = ["name"]

    def save(self, **kwargs):
        return self.Meta.model.objects.get_tag(name=self.validated_data["name"])
