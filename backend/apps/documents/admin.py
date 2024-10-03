from utils.admin import admin, BaseAdmin
from .models import *


@admin.register(Document)
class DocumentAdmin(BaseAdmin):
    pass


@admin.register(DocumentFileModel)
class DocumentFileModelAdmin(BaseAdmin):
    pass


@admin.register(Rating)
class RatingAdmin(BaseAdmin):
    pass
