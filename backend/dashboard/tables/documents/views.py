from rest_framework import viewsets, filters, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from documents.models import Document, DocumentFileModel
from .serializers import DocumentSerializer, DocumentFileModelRequestSerializer
from .filters import DocumentPagination, ORDERING_FIELDS, DocumentFilter
from accounts.permissions import IsAdmin


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = DocumentFilter
    ordering_fields = ORDERING_FIELDS
    pagination_class = DocumentPagination
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class FileContentViewSet(viewsets.ModelViewSet):
    queryset = DocumentFileModel.objects.all()
    serializer_class = DocumentFileModelRequestSerializer
    filter_backends = [DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter]
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def perform_create(self, serializer):
        document: Document = serializer.validated_data.pop('document_id')
        type_field = serializer.validated_data.pop('type')
        file = DocumentFileModel.objects.create(**serializer.validated_data,)
        if type_field == 'thumbnail':
            document.featured_image = file
            document.save()
        elif type_field == 'attach':
            document.files.add(file)
        return file
