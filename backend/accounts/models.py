from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group
from utils.models import TimestampedModel
from datetime import datetime


def user_profile_directory_path(instance, filename):
    current_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
    return 'profile/{}_{}'.format(current_datetime, filename)


class User(AbstractUser, TimestampedModel):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'email'],
    email = models.EmailField("email", unique=True, blank=True)


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile')
    image = models.ImageField(upload_to=user_profile_directory_path, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'
