from django.db import models
from accounts.models import User
from documents.models import Document
from utils.models import TimestampedModel
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

# Create your models here.


class UserAction(TimestampedModel):
    class ActionType(models.TextChoices):
        LIKE = "like", "Like"
        DISLIKE = "dislike", "Dislike"
        DOWNLOAD = "download", "Download"
        VIEW = "view", "View"

    type = models.CharField(
        max_length=20,
        choices=ActionType.choices,
    )
    target = models.ForeignKey(
        Document,  null=False, on_delete=models.CASCADE,)


class Status(models.TextChoices):
    PLANNED = "planned", "Planned"
    COMPLETED = "completed", "Completed"
    ERROR = "error", "Error"
    PROCESSING = "processing", "Processing"


class TrainType(models.TextChoices):
    CONTENT_BASED = "content-based", "Content-based"
    COLLABORATIVE = "collaborative", "Collaborative filtering"


class Export(TimestampedModel):
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNED,
    )
    train_type = models.CharField(
        max_length=20,
        choices=TrainType.choices,
        null=False,
    )
    file = models.FileField(verbose_name="Csv dataset file", )


class TrainModelData(TimestampedModel):
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNED,
    )
    train_type = models.CharField(
        max_length=20,
        choices=TrainType.choices,
        null=False,
    )
    file = models.FileField(verbose_name="Pickle model file", )
    documents_involved = models.ManyToManyField(Document,)
    users_involved = models.ManyToManyField(User,)
    description = models.TextField(null=False)
    last_user_action_id = models.PositiveSmallIntegerField(
        null=True, blank=True)
    export = models.OneToOneField(
        Export, null=False, on_delete=models.CASCADE, related_name='train_model_data')


class Suggestion(TimestampedModel):
    train_type = models.CharField(
        max_length=20,
        choices=TrainType.choices,
        null=False,
    )
    # user = models.ForeignKey(
    #     User, null=False, on_delete=models.CASCADE, related_name='suggestions')
    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    document = models.ForeignKey(
        Document, null=False, on_delete=models.CASCADE)
    rating_value = models.FloatField(default=0.0)
