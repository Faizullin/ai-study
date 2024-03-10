from rest_framework.pagination import PageNumberPagination
import django_filters
from accounts.models import User


class UserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(lookup_expr='icontains')
    username = django_filters.CharFilter(lookup_expr='icontains')
    created_at = django_filters.CharFilter(lookup_expr='icontains')
    updated_at = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    groups__name = django_filters.CharFilter(lookup_expr='exact')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'created_at',
                  'updated_at', 'groups__name',]


ORDERING_FIELDS = [
    'id', 'username', 'email', 'created_at', 'updated_at'
]
SEARCH_FILTERSET_FIELDS = {
    'id': ['exact', 'icontains'],
    'username': ['exact', 'icontains'],
    'email': ['exact', 'icontains'],
    'created_at': ['exact', 'year__gte', 'year__lte'],
    'updated_at': ['exact', 'year__gte', 'year__lte'],
}
