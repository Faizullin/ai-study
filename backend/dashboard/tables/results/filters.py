from rest_framework.pagination import PageNumberPagination
import django_filters
from results.models import Result


class ResultPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ResultFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(lookup_expr='icontains')
    title = django_filters.CharFilter(lookup_expr='icontains')
    created_at = django_filters.CharFilter(lookup_expr='icontains')
    updated_at = django_filters.CharFilter(lookup_expr='icontains')
    score = django_filters.CharFilter(lookup_expr='icontains')
    user__username = django_filters.CharFilter(lookup_expr='icontains')
    quiz__title = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Result
        fields = ['id', 'title', 'created_at',
                  'updated_at', 'score', 'user__username', 'quiz__title']


ORDERING_FIELDS = [
    'id', 'created_at', 'updated_at', 'score',
]
SEARCH_FILTERSET_FIELDS = {
    'id': ['exact', 'icontains'],
    'score': ['exact', 'icontains'],
    'created_at': ['exact', 'year__gte', 'year__lte'],
    'updated_at': ['exact', 'year__gte', 'year__lte'],
}
