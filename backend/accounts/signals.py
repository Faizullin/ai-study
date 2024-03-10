from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.db.models.signals import post_save, pre_save, pre_delete

from .models import User, Profile
from .serializers import UserSerializer
from django_rest_passwordreset.signals import reset_password_token_created
from utils.send_email_message_tasks import SiteUrls, send_email_message
from academics.models import get_current_academic_config
import logging


logger = logging.getLogger(__name__)


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    if not get_current_academic_config().email_enabled:
        return
    # send an e-mail to the user
    user: User = reset_password_token.user
    context = {
        'current_user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
        },
        'username': user.username,
        'email': user.email,
        'reset_password_url': "{}?token={}".format(SiteUrls.RESET_PASSWORD_CONFIRM_URL, reset_password_token.key),
        'app.content.html': 'email/user_reset_password.html',
        'app.content.txt': 'email/user_reset_password.txt',
        "app.title": "Password Reset for {title}".format(title=SiteUrls.SITE_COMMAND),
    }
    send_email_message(context, [reset_password_token.user.email])


@receiver(pre_save, sender=Profile)
def delete_previous_avatar(sender, instance: Profile, **kwargs):
    if instance.pk:
        previous_instance = Profile.objects.get(pk=instance.pk)
        if previous_instance.image and previous_instance.image != instance.image:
            try:
                previous_instance.image.delete(save=False)
            except Exception as err:
                logger.error(f"delete_image_on_profile_update Error: {err}")


@receiver(pre_delete, sender=Profile)
def delete_avatar_on_profile_delete(sender, instance: Profile, **kwargs):
    if instance.image:
        try:
            instance.image.delete(save=False)
        except Exception as err:
            logger.error(f"delete_image_on_profile_delete Error: {err}")


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
