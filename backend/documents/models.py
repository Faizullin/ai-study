from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from utils.models import TimestampedModel
from academics.models import Subject, Course
from accounts.models import User
from datetime import datetime
import os


def documents_file_directory_path(instance, filename):
    current_datetime = datetime.now().strftime('%Y%m%d%H%M%S')
    return 'files/{}_{}'.format(current_datetime, filename)


class DocumentFileModel(TimestampedModel):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=documents_file_directory_path, null=True)
    extension = models.CharField(max_length=10)
    size = models.CharField(max_length=20)

    def save(self, *args, **kwargs) -> None:
        if self.file:
            self.name = self.file.name
            self.extension = os.path.splitext(self.name)[1]
            self.size = self.file.size
        super().save(*args, **kwargs)

    def __str__(self):
        return f"DocumentFileModel {self.file} ({self.pk})"


class DocumentType(models.TextChoices):
    ARTICLE = "article", "Article"
    DOCUMENTATION = "documentation", "Documentation"
    LABWORK = "labwork", "Labwork"
    DOCUMENT = "document", "Document"


class Document(TimestampedModel):

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )
    type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.DOCUMENT,
    )
    title = models.CharField("Title", max_length=255)
    owner = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL)
    featured_image = models.ForeignKey(
        DocumentFileModel, null=True, blank=True, on_delete=models.SET_NULL, related_name='document_of_featured_image')
    description = models.TextField()
    content = RichTextUploadingField(config_name='default')
    files = models.ManyToManyField(
        DocumentFileModel,)
    subjects = models.ManyToManyField(Subject, )
    course = models.ForeignKey(
        Course, null=True, blank=True, on_delete=models.SET_NULL)
    rating_avg = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return f"Document {self.title} ({self.pk})"


class Rating(TimestampedModel):
    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE,)
    document = models.ForeignKey(
        Document,  null=False, on_delete=models.CASCADE, related_name='ratings')
    value = models.FloatField(default=0.0)
    # actions = models.ManyToManyField(UserAction)
