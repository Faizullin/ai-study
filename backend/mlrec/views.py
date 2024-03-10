from django.http import Http404
from rest_framework import status, filters, permissions
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.db.models import Count

from documents.models import Document, Subject, Course, User
from documents.filters import DocumentFilter, DocumentPagination
from documents.serializers import DocumentListSerializer, DocumentDetailSerializer, CourseFilterSerializer
from .serializers import TrainModelDataSerializer
from .models import Suggestion, TrainType, TrainModelData


# Create your views here.


class DocumentSuggestionCbListView(ListAPIView):
    serializer_class = DocumentListSerializer
    filter_backends = (DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter)
    pagination_class = DocumentPagination
    ordering_fields = ('id', 'created_at', 'updated_at')
    search_fields = ('id', 'title',)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        document = get_object_or_404(Document, id=self.kwargs.get('pk', None))
        ctype = ContentType.objects.get_for_model(Document)
        suggestion_queryset = Suggestion.objects.filter(
            train_type=TrainType.CONTENT_BASED, object_id=document.id, content_type=ctype).order_by('-rating_value').select_related('document')
        queryset = [i.document for i in suggestion_queryset]
        return queryset


class DocumentSuggestionCfListView(ListAPIView):
    serializer_class = DocumentListSerializer
    filter_backends = (DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter)
    pagination_class = DocumentPagination
    ordering_fields = ('id', 'created_at', 'updated_at')
    search_fields = ('id', 'title',)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        ctype = ContentType.objects.get_for_model(User)
        suggestion_queryset = Suggestion.objects.filter(
            train_type=TrainType.COLLABORATIVE, object_id=user.id, content_type=ctype).order_by('-rating_value').select_related('document')[0:50]
        queryset = [i.document for i in suggestion_queryset]
        # queryset = DocumentFilter(self.request.GET, queryset=queryset).qs
        return queryset


class TrainDataListView(ListAPIView):
    queryset = TrainModelData.objects.all()
    serializer_class = TrainModelDataSerializer
    filter_backends = (DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter)
    pagination_class = DocumentPagination
    ordering_fields = ('id', 'created_at', 'updated_at')
    permission_classes = []

    def get_queryset(self):
        return TrainModelData.objects.all()
