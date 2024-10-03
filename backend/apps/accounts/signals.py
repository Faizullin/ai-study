import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile, UserModel

logger = logging.getLogger(__name__)


@receiver(post_save, sender=UserModel)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
