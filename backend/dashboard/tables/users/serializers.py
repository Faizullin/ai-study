from rest_framework import serializers
from utils.serializers import TimestampedSerializer
from accounts.models import User, Group, Profile


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
    roles = serializers.SerializerMethodField(read_only=True)
    roles_names = serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        many=True,
        write_only=True,
        slug_field='name'
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'created_at',
                  'updated_at', 'roles', 'roles_names', 'profile')

    def get_roles(self, obj: User):
        return obj.groups.values_list("name", flat=True)

    def get_profile(self, obj: User):
        return UserProfileSerializer(obj.profile, context=self.context).data

    def update(self, instance: User, validated_data):
        roles_data = validated_data.pop('roles_names', [])
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        instance.groups.set(roles_data)
        return instance
