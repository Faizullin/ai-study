from apps.academics.models import Course
from django.contrib.auth import get_user_model
from django.db import models

UserModel = get_user_model()


class Profile(models.Model):
    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name='profile')
    subscribed_courses = models.ManyToManyField(Course, blank=True,)

    def __str__(self):
        return f'{self.user.username} Profile'
