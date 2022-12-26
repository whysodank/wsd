from rest_framework.serializers import ModelSerializer


class BaseModelSerializer(ModelSerializer):
    force_current_user_fields = []
