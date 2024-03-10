from django.contrib import admin
from .models import TrainModelData, Export, Suggestion

# Register your models here.
admin.site.register(Export)
admin.site.register(TrainModelData)
admin.site.register(Suggestion)