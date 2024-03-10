from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import Document, DocumentFileModel
import logging


logger = logging.getLogger(__name__)


@receiver(pre_save, sender=Document)
def pre_save_document(sender, instance: Document, *args, **kwargs):
    try:
        prev_instance: Document = instance.__class__.objects.get(
            id=instance.id)
        old_file = prev_instance.featured_image
        try:
            new_file = instance.featured_image
        except:
            new_file = None
        if new_file and old_file and new_file.pk != old_file.pk:
            old_file.delete()
    except Exception as err:
        logger.error(f"pre_save_document Error: {err}")


@receiver(post_delete, sender=Document)
def post_delete_document(sender, instance: Document, *args, **kwargs):
    try:
        instance.featured_image.delete()
        instance.files.all().delete()
    except Exception as err:
        logger.error(f"post_delete_document Error: {err}")
