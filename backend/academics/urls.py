from django.urls import path
from .views import *

app_name = 'academics'

urlpatterns = [
    path('api/courses/<int:pk>/subscribe/',
         CourseSubscribeView.as_view(), name='course-subscribe'),
]
