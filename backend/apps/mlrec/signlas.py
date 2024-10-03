import logging
import os

from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .models import Export

logger = logging.getLogger(__name__)


@receiver(pre_delete, sender=Export)
def pre_delete_export(sender, instance: Export, **kwargs):
    if instance.file:
        try:
            if os.path.exists(instance.file.name):
                os.remove(instance.file.name)
            # instance.file.delete(save=False)
        except Exception as err:
            logger.error(f"pre_delete_export Error: {err}")
