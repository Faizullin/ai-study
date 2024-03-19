from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from utils.serializers import TimestampedSerializer
from .groups import StudentGroup
from .models import User, Profile, Group
from academics.models import Course


class UserProfileSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField(read_only=True)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ('id', 'image', 'url',)

    def get_url(self, obj: Profile):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if obj.image else None


class UserSerializer(TimestampedSerializer):
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField(read_only=True)
    profile = serializers.SerializerMethodField(read_only=True)
    roles = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name',
                  'email', 'created_at', 'updated_at', 'profile', 'roles')

    def get_roles(self, obj: User):
        return obj.groups.values_list('name', flat=True)

    def get_profile(self, obj: User):
        return UserProfileSerializer(obj.profile, context=self.context).data


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[validate_password])
    password_confirmation = serializers.CharField(write_only=True, )
    # first_name = serializers.CharField(write_only=True,)
    # last_name = serializers.CharField(write_only=True,)

    class Meta:
        model = User
        fields = ('id', 'username', 'email',
                  'password', 'password_confirmation')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            # first_name=validated_data['first_name'],
            # last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        user.groups.set([Group.objects.get(id=StudentGroup.id)])
        return user

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True, write_only=True, validators=[validate_password])
    new_password_confirmation = serializers.CharField(
        required=True, write_only=True)

    class Meta:
        model = User

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirmation']:
            raise serializers.ValidationError(
                {"new_password": "Password fields didn't match."})
        return attrs

    def update(self, instance: User, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance


class UserProfileCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'subject', 'image')
