from django.http import Http404
from rest_framework import status, filters, permissions
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Document, Subject, Course, Rating
from .serializers import DocumentRateRequestSerializer, DocumentListSerializer, DocumentDetailSerializer, CourseFilterSerializer, SubjectFilterSerializer
from .filters import DocumentFilter, DocumentPagination


class FiltersView(ListAPIView):
    def get_queryset(self):
        filter_type = self.kwargs.get('filter_type')
        if filter_type == 'courses':
            queryset = Course.objects.all()
        elif filter_type == 'subjects':
            queryset = Subject.objects.all()
        else:
            raise Http404
        return queryset

    def get_serializer_class(self):
        filter_type = self.kwargs.get('filter_type')
        if filter_type == 'courses':
            return CourseFilterSerializer
        elif filter_type == 'subjects':
            return SubjectFilterSerializer


class DocumentDetailView(RetrieveAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class DocumentListView(ListAPIView):
    serializer_class = DocumentListSerializer
    filter_backends = (DjangoFilterBackend,
                       filters.OrderingFilter, filters.SearchFilter)
    pagination_class = DocumentPagination
    ordering_fields = ('id', 'created_at', 'updated_at')
    search_fields = ('id', 'title',)
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Document.objects.all()
        use_user_subscribed = self.request.query_params.get("subscribed", None)
        if use_user_subscribed is not None:
            user_subscribed_courses = self.request.user.profile.subscribed_courses.all()
            if use_user_subscribed is False or use_user_subscribed == 'false':
                queryset = queryset.exclude(course__in=user_subscribed_courses)
            if use_user_subscribed is True or use_user_subscribed == 'true':
                queryset = queryset.filter(course__in=user_subscribed_courses)
        queryset = DocumentFilter(
            self.request.GET, queryset=queryset).qs.order_by('-created_at')
        return queryset


class DocumentPopularView(APIView):
    def get(self, request):
        queryset = DocumentFilter(
            self.request.GET, queryset=Document.objects.all()).qs
        documents = queryset.order_by('-rating_avg').prefetch_related("featured_image")[:3]
        return Response(DocumentListSerializer(documents, many=True, context={'request': request, }).data, status=status.HTTP_200_OK)


class DocumentRateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        document = get_object_or_404(Document, pk=pk)
        serializer = DocumentRateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rating_value: int = serializer.validated_data.get('value', 0)
        rating, created = Rating.objects.get_or_create(
            user=self.request.user,
            document=document,
            defaults={
                'value': rating_value,
            }
        )
        if not created:
            rating.value = rating_value
            rating.save()
        return Response({'detail': f"rated at {rating_value}", "value": rating_value}, status=status.HTTP_200_OK)

# class DocumentPopularApiView(APIView):
#     # permission_classes = [permissions.IsAuthenticated]

#     def post(self):
#         serializer = DocumentAIApiRequestSerializer()
#         serializer.is_valid(raise_exception=True)
#         validated_data = serializer.validated_data
#         if validated_data['type']
#             if not validated_data['target']:
#                 return Response({'detail': "Target is missing"}, status=status.HTTP_400_BAD_REQUEST)

#             # items = Document.objects.all()
#             # dataset_ids = get_recommendations()
#             # queryset =
#         return Response({'detail': "unknown request type"}, status=status.HTTP_400_BAD_REQUEST)
