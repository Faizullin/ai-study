from utils.admin import BaseAdmin, admin
from .models import TrainModelData, Export, Suggestion


@admin.register(Export)
class ExportAdmin(BaseAdmin):
    pass


@admin.register(TrainModelData)
class TrainModelDataAdmin(BaseAdmin):
    pass


@admin.register(Suggestion)
class SuggestionAdmin(BaseAdmin):
    pass
