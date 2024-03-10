from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'exports', ExportViewSet)
router.register(r'train-model-data', TrainModelDataViewSet)

urlpatterns = [
    path('train/cb/', TrainModelCbAPIView.as_view()),
    path('train/cf/', TrainModelCfAPIView.as_view()),
    path('export/dataset/', ExportDatatsetAPIView.as_view()),
    path('', include(router.urls)),
]
