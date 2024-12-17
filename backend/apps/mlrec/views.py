from apps.documents.filters import DocumentFilter, DocumentPagination
from apps.documents.models import Document
from apps.documents.serializers import DocumentListSerializer
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions
from rest_framework.generics import ListAPIView

from .models import Suggestion, TrainModelData, TrainType
from .serializers import TrainModelDataSerializer

UserModel = get_user_model()


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
            train_type=TrainType.CONTENT_BASED, object_id=document.id, content_type=ctype).order_by(
            '-rating_value').select_related('document')
        queryset = [i.document for i in suggestion_queryset]
        return queryset


# class DocumentSuggestionCbIndividualListView(ListAPIView):
#     serializer_class = DocumentListSerializer
#     filter_backends = (DjangoFilterBackend,
#                        filters.OrderingFilter, filters.SearchFilter)
#     pagination_class = DocumentPagination
#     ordering_fields = ('id', 'created_at', 'updated_at')
#     search_fields = ('id', 'title',)
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         profile: Profile = self.request.user.profile
#         user_profile_courses = profile.subscribed_courses.all()
#         document_queryset = Document.objects.filter(
#             course__in=user_profile_courses).order_by('-created_at')
#         document = get_object_or_404(Document, id=self.kwargs.get('pk', None))
#         ctype = ContentType.objects.get_for_model(Document)
#         suggestion_queryset = Suggestion.objects.filter(
#             train_type=TrainType.CONTENT_BASED, object_id=document.id, content_type=ctype).order_by('-rating_value').select_related('document')
#         queryset = [i.document for i in suggestion_queryset]
#         return queryset


class DocumentSuggestionCfListView(ListAPIView):
    serializer_class = DocumentListSerializer
    filter_backends = (DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter)
    pagination_class = DocumentPagination
    ordering_fields = ('id', 'created_at', 'updated_at')
    search_fields = ('id', 'title',)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        use_user_subscribed = self.request.query_params.get("subscribed", None)
        user = self.request.user
        ctype = ContentType.objects.get_for_model(UserModel)
        suggestion_queryset = Suggestion.objects.filter(
            train_type=TrainType.COLLABORATIVE, object_id=user.id, content_type=ctype).order_by('-rating_value')[0:50]
        document_ids = suggestion_queryset.values_list(
            'document_id', flat=True)
        queryset = Document.objects.filter(id__in=document_ids)
        if use_user_subscribed is not None:
            user_subscribed_courses = self.request.user.profile.subscribed_courses.all()
            if use_user_subscribed is False or use_user_subscribed == 'false':
                queryset = queryset.exclude(course__in=user_subscribed_courses)
            if use_user_subscribed is True or use_user_subscribed == 'true':
                queryset = queryset.filter(course__in=user_subscribed_courses)
        queryset = DocumentFilter(self.request.GET, queryset=queryset).qs
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
