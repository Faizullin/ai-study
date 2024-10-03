from django.contrib import admin

from utils.admin import BaseAdmin
from .models import AcademicConfig, Subject, Course


@admin.register(AcademicConfig)
class AcademicConfigAdmin(BaseAdmin):
    pass


@admin.register(Subject)
class SubjectAdmin(BaseAdmin):
    pass


@admin.register(Course)
class CourseAdmin(BaseAdmin):
    pass
