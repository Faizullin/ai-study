from django.urls import path
from .views import FiltersView, DocumentPopularView, DocumentListView, DocumentDetailView, DocumentRateView

app_name = 'documents'

urlpatterns = [
    path('api/filters/<str:filter_type>/',
         FiltersView.as_view(), name='filters-list'),
    path('api/documents/popular/',
         DocumentPopularView.as_view(), name='document-ai-list'),
    path('api/documents/',
         DocumentListView.as_view(), name='document-list'),
    path('api/documents/<int:pk>/',
         DocumentDetailView.as_view(), name='document-detail'),
    path('api/documents/<int:pk>/rate/',
         DocumentRateView.as_view(), name='document-rate'),
]
