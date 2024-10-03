from datetime import datetime

from django.db import models

from utils.models import AbstractTimestampedModel


def course_image_file_directory_path(instance, filename):
    current_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
    return 'files/{}_{}'.format(current_datetime, filename)


class AcademicConfig(AbstractTimestampedModel):
    email_enabled = models.BooleanField(default=False, null=False)


class Subject(AbstractTimestampedModel):
    title = models.CharField(max_length=255, unique=True, null=False)


class Course(AbstractTimestampedModel):
    title = models.CharField(max_length=255, unique=True, null=False)
    image = models.ImageField(upload_to=course_image_file_directory_path)
    subject = models.ForeignKey(
        Subject, null=True, blank=True, on_delete=models.SET_NULL)


def get_current_academic_config():
    return AcademicConfig.objects.last()
