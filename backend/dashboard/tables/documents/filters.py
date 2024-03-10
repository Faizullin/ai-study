from rest_framework.pagination import PageNumberPagination
import django_filters
from documents.models import Document


class DocumentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class DocumentFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(lookup_expr='icontains')
    status = django_filters.CharFilter(lookup_expr='exact')
    type = django_filters.CharFilter(lookup_expr='exact')
    title = django_filters.CharFilter(lookup_expr='icontains')
    owner__username = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    course = django_filters.CharFilter(lookup_expr='exact')
    rating_avg = django_filters.CharFilter(lookup_expr='icontains')
    created_at = django_filters.CharFilter(lookup_expr='icontains')
    updated_at = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Document
        fields = ['id', 'status', 'type', 'title', 'owner__username',
                  'description', 'course', 'rating_avg', 'created_at', 'updated_at',]


ORDERING_FIELDS = [
    'id', 'rating_avg', 'created_at', 'updated_at'
]
SEARCH_FILTERSET_FIELDS = {
    'id': ['exact', 'icontains'],
    'title': ['exact', 'icontains'],
    'created_at': ['exact', 'year__gte', 'year__lte'],
    'updated_at': ['exact', 'year__gte', 'year__lte'],
}
