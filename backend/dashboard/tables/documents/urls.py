from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


file_router = DefaultRouter()
file_router.register(r'', FileContentViewSet)
router = DefaultRouter()
router.register(r'', DocumentViewSet)

urlpatterns = [
    path('files/', include(file_router.urls)),
    path('', include(router.urls)),
]
