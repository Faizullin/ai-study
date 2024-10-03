from apps.academics.models import Course
from dj_rest_auth.serializers import \
    JWTSerializerWithExpiration as _BaseJWTSerializerWithExpiration
from dj_rest_auth.serializers import \
    PasswordResetSerializer as _BasePasswordResetSerializer
from utils.serializers import get_datetime_formatted, serializers


class JWTSerializerWithExpiration(_BaseJWTSerializerWithExpiration):
    """
    Serializer for JWT authentication with expiration times.
    """
    access_expiration = serializers.SerializerMethodField(read_only=True)
    refresh_expiration = serializers.SerializerMethodField(read_only=True)

    def get_access_expiration(self, obj):
        return get_datetime_formatted(obj['access_expiration'])

    def get_refresh_expiration(self, obj):
        return get_datetime_formatted(obj['refresh_expiration'])


class PasswordResetSerializer(_BasePasswordResetSerializer):
    pass
    # def get_email_options(self):
    #     return {
    #         'subject_template_name': 'registration/password_reset_subject.txt',
    #         'email_template_name': 'registration/password_reset_message.txt',
    #         'html_email_template_name': 'registration/'
    #                                     'password_reset_message.html',
    #         'extra_email_context': {
    #             'pass_reset_obj': self.your_extra_reset_obj
    #         }
    #     }
    # def save(self):
    #     request = self.context.get('request')
    #     opts = {
    #         'use_https': request.is_secure(),
    #         'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
    #
    #         ###### USE YOUR TEXT FILE ######
    #         'email_template_name': 'example_message.txt',
    #
    #         'request': request,
    #     }
    #     self.reset_form.save(**opts)


class UserProfileCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'subject', 'image')
