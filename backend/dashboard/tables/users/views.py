from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from accounts.models import User
from .serializers import UserSerializer
from .filters import UserPagination, ORDERING_FIELDS, UserFilter, SEARCH_FILTERSET_FIELDS
from accounts.permissions import IsAdmin


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter]
    filterset_class = UserFilter
    ordering_fields = ORDERING_FIELDS
    pagination_class = UserPagination
    search_fields = SEARCH_FILTERSET_FIELDS
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        return super().get_queryset() # .exclude(groups__name = 'admin')
