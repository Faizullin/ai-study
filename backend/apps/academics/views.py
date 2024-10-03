from rest_framework import status, permissions
from rest_framework import status, permissions
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response

from .models import Course


class CourseSubscribeAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        profile = self.request.user.profile
        if not profile.subscribed_courses.contains(instance):
            return Response({'detail': f"You are not subscribed to course {instance.title}"},
                            status=status.HTTP_400_BAD_REQUEST)
        profile.subscribed_courses.remove(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        instance: Course = self.get_object()
        profile = self.request.user.profile
        if profile.subscribed_courses.contains(instance):
            return Response({'detail': f"You already subscribed to course {instance.title}"},
                            status=status.HTTP_400_BAD_REQUEST)
        profile.subscribed_courses.add(instance)
        return Response({'detail': f"You subscribed to course {instance.title}"}, status=status.HTTP_200_OK)
