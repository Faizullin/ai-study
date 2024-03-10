from rest_framework import serializers
from utils.serializers import TimestampedSerializer
from documents.models import Document, Subject, Course, DocumentFileModel
from dashboard.tables.users.serializers import UserSerializer


MAX_THUMBNAIL_SIZE = 5 * 1024  # KB
MAX_FILE_SIZE = 100 * 1024  # KB


class SubjectSerializer(TimestampedSerializer):
    class Meta:
        model = Subject
        fields = ('id', 'title', 'created_at', 'updated_at')


class CourseSerializer(TimestampedSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'created_at', 'updated_at')


class DocumentFileModelSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DocumentFileModel
        fields = ('id', 'url', 'size', 'name', 'extension')

    def get_url(self, obj: DocumentFileModel):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file else ""


class DocumentSerializer(TimestampedSerializer):
    course = CourseSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        write_only=True,
    )
    subjects = SubjectSerializer(many=True, read_only=True)
    subject_ids = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        many=True,
        write_only=True,
    )
    featured_image = DocumentFileModelSerializer(read_only=True)
    files = DocumentFileModelSerializer(many=True, required=False)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Document
        fields = ['id', 'status', 'type', 'title', 'owner',
                  'description', 'course', 'course_id', 'subjects', 'subject_ids', 'files', 'featured_image', 'rating_avg', 'content', 'created_at', 'updated_at',]

    def create(self, validated_data):
        subjects = validated_data.pop('subject_ids', [])
        document = Document.objects.create(
            **validated_data, owner=self.context['request'].user)
        document.subjects.set(subjects)
        return document

    def update(self, instance: Document, validated_data):
        subjects = validated_data.pop('subject_ids', "EMPTY")
        course = validated_data.pop('course_id', "EMPTY")
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if course != "EMPTY":
            instance.course = course
        instance.save()
        if subjects != "EMPTY":
            instance.subjects.set(subjects)
        return instance


class DocumentFileModelRequestSerializer(serializers.Serializer):
    document_id = serializers.PrimaryKeyRelatedField(
        write_only=True, required=True, queryset=Document.objects.all())
    document = DocumentSerializer(read_only=True)
    type = serializers.CharField(write_only=True, required=True)
    file = serializers.FileField()

    def validate(self, attrs):
        type_field = attrs.get('type')
        file = attrs.get('file')
        if type_field != 'thumbnail' and type_field != 'attach':
            raise serializers.ValidationError(
                {'file': 'File type is not provided.'})
        if type_field == 'thumbnail':
            raise serializers.ValidationError(
                {'file': 'Image size cannot exceed 5MB for thumbnail type.'})
        elif type_field  == 'attach':
            raise serializers.ValidationError(
                {'file': 'File size cannot exceed 100MB for thumbnail type.'})
        return super().validate(attrs)
