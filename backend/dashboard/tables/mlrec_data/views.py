from rest_framework import viewsets, filters, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from mlrec.models import Export, TrainModelData
from .serializers import ExportSerializer, TrainModelDataSerializer
from .filters import ExportPagination, ORDERING_FIELDS, ExportFilter, TrainModelDataFilter, TrainModelDataPagination
from accounts.permissions import IsAdmin
from mlrec.tasks import train_cb_model_and_batch_user_prediction_task, train_cf_model_task, export_dataset_task


class ExportViewSet(viewsets.ModelViewSet):
    queryset = Export.objects.all()
    serializer_class = ExportSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ExportFilter
    ordering_fields = ORDERING_FIELDS
    pagination_class = ExportPagination
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class TrainModelDataViewSet(viewsets.ModelViewSet):
    queryset = TrainModelData.objects.all()
    serializer_class = TrainModelDataSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = TrainModelDataFilter
    ordering_fields = ORDERING_FIELDS
    pagination_class = TrainModelDataPagination
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class TrainModelCbAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        train_cb_model_and_batch_user_prediction_task.delay()
        return Response({
            'detail': "Success"
        })


class TrainModelCfAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        train_cf_model_task.delay()
        return Response({
            'detail': "Success"
        })


class ExportDatatsetAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def post(self, request):
        export_dataset_task.delay()
        return Response({
            'detail': "Success"
        })
