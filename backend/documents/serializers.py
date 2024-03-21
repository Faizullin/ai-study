from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer
from utils.serializers import TimestampedSerializer
from accounts.models import User
from accounts.serializers import UserProfileSerializer
from .models import Document, DocumentFileModel, Subject, Course
from mlrec.models import TrainType


class SubjectFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('id', 'title', )


class CourseFilterSerializer(serializers.ModelSerializer):
    subject = SubjectFilterSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'subject', 'image')


class OwnerSerializer(TimestampedSerializer):
    profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'profile',)

    def get_profile(self, obj: User):
        return UserProfileSerializer(obj.profile, context=self.context).data


class DocumentFileModelSerializer(TimestampedSerializer):
    url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = DocumentFileModel
        fields = ('id', 'url', 'size', 'name', 'extension')

    def get_url(self, obj: DocumentFileModel):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.file.url) if obj.file else ""


class DocumentListSerializer(TimestampedSerializer):
    owner = OwnerSerializer(read_only=True)
    featured_image = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Document
        fields = ('id', 'status', 'type', 'language', 'title', 'owner', 'featured_image', 'description', 'content',
                  'subjects', 'course', 'rating_avg', 'rating_count',  'created_at', 'updated_at')

    def get_featured_image(self, obj: Document):
        return DocumentFileModelSerializer(obj.featured_image, context=self.context).data if hasattr(obj, 'featured_image') else None


class DocumentDetailSerializer(TimestampedSerializer):
    owner = OwnerSerializer(read_only=True)
    featured_image = serializers.SerializerMethodField(read_only=True)
    files = DocumentFileModelSerializer(read_only=True, many=True)
    subjects = SubjectFilterSerializer(read_only=True, many=True)
    course = CourseFilterSerializer(read_only=True)
    my_rating_value = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Document
        fields = ('id', 'status', 'type', 'language',  'title', 'owner', 'featured_image', 'description', 'content',
                  'files', 'subjects', 'course', 'rating_avg', 'rating_count', 'my_rating_value', 'created_at', 'updated_at')

    def get_featured_image(self, obj: Document):
        return DocumentFileModelSerializer(obj.featured_image, context=self.context).data if hasattr(obj, 'featured_image') else None

    def get_my_rating_value(self, obj: Document):
        user = self.context['request'].user
        item = obj.ratings.filter(user=user).last()
        return None if not item else item.value


class DocumentAIApiRequestSerializer(serializers.Serializer):
    ai_type = serializers.ChoiceField(choices=TrainType.choices)
    target = serializers.CharField()


class DocumentRateRequestSerializer(serializers.Serializer):
    value = serializers.IntegerField(max_value=5, min_value=0)
