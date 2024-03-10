from django.urls import path
from .views import DocumentSuggestionCbListView, DocumentSuggestionCfListView, TrainDataListView

app_name = 'mlrec'

urlpatterns = [
    path('api/mlrec/cf/',
         DocumentSuggestionCfListView.as_view(), name='mlrec-cf'),
    path('api/mlrec/cb/<int:pk>/',
         DocumentSuggestionCbListView.as_view(), name='mlrec-cb'),
    path('api/mlrec/train_data/',
         TrainDataListView.as_view(), name='mlrec-train_data'),
]
