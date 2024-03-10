from rest_framework.pagination import PageNumberPagination
import django_filters
from mlrec.models import Export, TrainModelData


class ExportPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ExportFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(lookup_expr='icontains')
    train_type = django_filters.CharFilter(lookup_expr='exact')
    status = django_filters.CharFilter(lookup_expr='exact')
    created_at = django_filters.CharFilter(lookup_expr='icontains')
    updated_at = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Export
        fields = ['id', 'train_type', 'status', 'created_at', 'updated_at',]


class TrainModelDataPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class TrainModelDataFilter(django_filters.FilterSet):
    id = django_filters.CharFilter(lookup_expr='icontains')
    train_type = django_filters.CharFilter(lookup_expr='exact')
    status = django_filters.CharFilter(lookup_expr='exact')
    created_at = django_filters.CharFilter(lookup_expr='icontains')
    updated_at = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = TrainModelData
        fields = ['id', 'train_type', 'status',  'created_at', 'updated_at',]


FILTERSET_FIELDS = {
    'id': ['exact', 'icontains'],
    'created_at': ['exact', 'year__gte', 'year__lte'],
    'updated_at': ['exact', 'year__gte', 'year__lte'],
}
ORDERING_FIELDS = [
    'id', 'created_at', 'updated_at'
]
SEARCH_FILTERSET_FIELDS = {
    'id': ['exact', 'icontains'],
    'created_at': ['exact', 'year__gte', 'year__lte'],
    'updated_at': ['exact', 'year__gte', 'year__lte'],
}
