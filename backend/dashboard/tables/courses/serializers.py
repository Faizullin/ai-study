from rest_framework import serializers
from documents.models import Course, Subject
from utils.serializers import TimestampedSerializer
from dashboard.tables.subjects.serializers import SubjectSerializer


class CourseSerializer(TimestampedSerializer):
    subject = SubjectSerializer(read_only=True)
    subject_id = serializers.PrimaryKeyRelatedField(
        write_only=True, required=False, queryset=Subject.objects.all())
    
    class Meta:
        model = Course
        fields = ('id', 'title', 'subject', 'subject_id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        subject = validated_data.pop('subject_id', None)
        document = Course.objects.create( **validated_data, subject = subject)
        return document

    def update(self, instance: Subject, validated_data):
        subject = validated_data.pop('subject_id', "NONE")
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if subject != "NONE":
            instance.subject = subject
        instance.save()
        return instance
