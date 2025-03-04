from rest_framework import serializers


def create_tag_serializer(tag_class):
    """Returns a DRF field serializer for handling tags as a list of names."""

    max_length = tag_class._meta.get_field("name").max_length

    class TagCharField(serializers.CharField):
        """Custom CharField with max length validation"""

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

        def to_internal_value(self, value):
            if len(value) > self.max_length:
                raise serializers.ValidationError(f"Tag '{value}' exceeds max length of {max_length} characters.")
            return tag_class.objects.get_tag(name=value)

    class TagField(serializers.ListField):
        child = TagCharField(max_length=max_length)

        def to_representation(self, value):
            return value.to_list()

    return TagField()
