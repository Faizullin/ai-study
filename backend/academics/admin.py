from django.contrib import admin
from .models import AcademicConfig, Subject, Course

# Register your models here.
admin.site.register(AcademicConfig, )
admin.site.register(Subject, )
admin.site.register(Course, )
