from rest_framework import serializers
from mlrec.models import Export, TrainModelData
from utils.serializers import TimestampedSerializer


class ExportSerializer(TimestampedSerializer):
    file = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Export
        fields = ('id', 'train_type',  'status',
                  'file', 'created_at', 'updated_at')

    def get_file(self, obj: Export):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file else ""


class TrainModelDataSerializer(TimestampedSerializer):
    file = serializers.SerializerMethodField(read_only=True)
    export = ExportSerializer(read_only=True)

    class Meta:
        model = TrainModelData
        fields = ('id', 'train_type',  'status', 'export',
                  'file', 'description', 'created_at', 'updated_at')

    def get_file(self, obj: TrainModelData):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file else ""
