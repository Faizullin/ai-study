from django.apps import AppConfig


class MlrecConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mlrec'

    def ready(self) -> None:
        import mlrec.signlas
