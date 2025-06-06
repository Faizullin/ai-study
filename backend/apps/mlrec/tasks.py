import logging

from celery import shared_task
from celery.utils.log import get_task_logger

from apps.documents.models import Document
from .models import Status, Export, TrainModelData, TrainType
from .utils import save_cb_pd_dataset, save_cf_pd_dataset, load_model, CollaborativeFilteringModel, \
    ContentBasedFilteringModel

logger = logging.getLogger(__name__)


@shared_task
def export_dataset_task():
    documents = Document.objects.prefetch_related('ratings').all()
    logger.info("start export")
    save_cf_pd_dataset(documents)
    save_cb_pd_dataset(documents)
    logger.info("end export")


@shared_task
def train_cf_model_task():
    last_train_export = Export.objects.filter(
        train_type=TrainType.COLLABORATIVE).last()
    logger.info("start train_cf_model_task: for " + str(last_train_export))
    if not last_train_export:
        # documents = Document.objects.all()
        # save_cf_pd_dataset(documents)
        return

    last_train_model = TrainModelData.objects.filter(
        train_type=TrainType.COLLABORATIVE).last()
    if last_train_model:
        if last_train_model.status == Status.PROCESSING:
            return
    CollaborativeFilteringModel().train(last_train_export)
    logger.info("end train_cf_model_task: for " + str(last_train_export))


@shared_task
def train_cb_model_and_batch_user_prediction_task():
    last_train_export = Export.objects.filter(
        train_type=TrainType.CONTENT_BASED).last()
    logger.info("start train_cb_model_and_batch_user_prediction_task: for " + str(last_train_export))
    if not last_train_export:
        # documents = Document.objects.all()
        # save_cb_pd_dataset(documents)
        return
    last_train_model = TrainModelData.objects.filter(
        train_type=TrainType.CONTENT_BASED).last()
    if last_train_model:
        if last_train_model.status == Status.PROCESSING:
            return
    ContentBasedFilteringModel().train_and_batch(last_train_export)
    logger.info("end train_cb_model_and_batch_user_prediction_task: for " + str(last_train_export))


@shared_task
def batch_cf_user_prediction_task():
    logger.info("start batch_cf_user_prediction_task")
    ret, model = load_model()
    if ret:
        CollaborativeFilteringModel().batch_user_predictions(0, 250, model=model)
    logger.info("start batch_cf_user_prediction_task")
