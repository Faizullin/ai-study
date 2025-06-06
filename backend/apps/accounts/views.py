from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView as _BaseRegisterView
from dj_rest_auth.registration.views import \
    VerifyEmailView as _BaseVerifyEmailView
from dj_rest_auth.utils import jwt_encode
from dj_rest_auth.views import LoginView as _BaseLoginView
from dj_rest_auth.views import PasswordResetView as _BasePasswordResetView
from dj_rest_auth.views import UserDetailsView as _BaseUserDetailsView
from rest_framework import generics

from apps.academics.models import Course
from .permissions import permissions
from .serializers import UserProfileCourseSerializer, UserDetailSerializer


class LoginView(_BaseLoginView):
    def login(self):
        self.user = self.serializer.validated_data['user']
        self.access_token, self.refresh_token = jwt_encode(self.user)


class RegisterView(_BaseRegisterView):
    pass


class VerifyEmailView(_BaseVerifyEmailView):
    pass


class TokenRefreshView(get_refresh_view()):
    pass


class PasswordResetView(_BasePasswordResetView):
    pass


class UserProfileCourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = UserProfileCourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.subscribed_courses.all()


class UserDetailsView(_BaseUserDetailsView):
    serializer_class = UserDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)
