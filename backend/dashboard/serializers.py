from rest_framework import serializers
from utils.serializers import TimestampedSerializer


class DiskSpaceSerializer(serializers.Serializer):
    total_space = serializers.IntegerField()
    used_space = serializers.IntegerField()
    free_space = serializers.IntegerField()
    percent_used = serializers.FloatField()
