from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from academics.models import Subject, Course
from .serializers import UserRegisterSerializer, UserSerializer, UserProfileSerializer, ChangePasswordSerializer, UserProfileCourseSerializer
from .models import User, Profile
import logging

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer


class AuthUserView(APIView):
    authentication_classes = [JWTAuthentication, ]
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_context(self):
        context = {}
        context.update({
            "request": self.request
        })
        return context

    def get(self, request, *args, **kwargs):
        user = request.user
        data = UserSerializer(user, context=self.get_serializer_context()).data
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        return Response(UserSerializer(instance, context=self.get_serializer_context()).data, status=status.HTTP_200_OK)


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class UpdateProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Profile.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({
            "request": self.request
        })
        return context

    def get_object(self) -> Profile:
        return self.request.user.profile

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.image.delete(save=False)
            instance.image = None
            instance.save()
        except Exception as err:
            logger.error(f"UpdateProfileView Error: {err}")
        return Response(UserProfileSerializer(instance, context=self.get_serializer_context()).data, status=status.HTTP_200_OK)


class UserProfileCourseListView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = UserProfileCourseSerializer 
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.profile.subscribed_courses.all()
