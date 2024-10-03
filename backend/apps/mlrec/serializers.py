from rest_framework import serializers
from utils.serializers import TimestampedSerializer
from .models import TrainModelData


class TrainModelDataSerializer(TimestampedSerializer):
    documents_involved_count = serializers.IntegerField(
        source="documents_involved.count", read_only=True)
    users_involved_count = serializers.IntegerField(
        source="users_involved.count", read_only=True)

    class Meta:
        model = TrainModelData
        fields = ('id', 'status', 'export', 'train_type', 'description',
                  'documents_involved_count', 'users_involved_count', 'created_at', 'updated_at')
