from django.urls import path
from .views import CourseSubscribeAPIView

app_name = 'academics'

urlpatterns = [
    path('api/courses/<int:pk>/subscribe/', CourseSubscribeAPIView.as_view(), name='course-subscribe'),
]
