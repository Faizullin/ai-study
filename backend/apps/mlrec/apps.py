from django.apps import AppConfig


class MlrecConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.mlrec'

    def ready(self) -> None:
        import apps.mlrec.signlas
