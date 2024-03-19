from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as django_filters_rest
from django.db.models import Q
from .models import Document, Course, Subject, DocumentType
from django_filters import filters


class DocumentPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    


class DocumentFilter(django_filters_rest.FilterSet):
    type = django_filters_rest.ChoiceFilter(
        field_name='type',
        label='Type',
        choices=DocumentType.choices
    )
    course = django_filters_rest.CharFilter(
        field_name='course__id',
        label='Course id',
    )
    subjects = django_filters_rest.ModelMultipleChoiceFilter(
        field_name='subjects',
        queryset=Subject.objects.all(),
        label='Subjects ids',
    )
    search = filters.CharFilter(method='filter_by_search')

    class Meta:
        model = Document
        fields = ['id', 'title', 'type', 'subjects', 'course',]

    def filter_by_search(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(title__icontains=value) | Q(description__icontains=value)
            )
        return queryset
