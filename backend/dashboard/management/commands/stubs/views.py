from rest_framework import viewsets, filters, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from dashboard.models import {ModelName}
from .serializers import {ModelName}Serializer
from .filters import {ModelName}Pagination, ORDERING_FIELDS, {ModelName}Filter, SEARCH_FILTERSET_FIELDS
from accounts.permissions import IsAdmin


class {ModelName}ViewSet(viewsets.ModelViewSet):
    queryset = {ModelName}.objects.all()
    serializer_class = {ModelName}Serializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = {ModelName}Filter
    ordering_fields = ORDERING_FIELDS
    pagination_class = {ModelName}Pagination
    search_fields = SEARCH_FILTERSET_FIELDS
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
