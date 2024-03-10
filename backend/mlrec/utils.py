from celery.utils.log import get_task_logger
import os
import json
import time
import pickle
import numpy as np
import pandas as pd
from django.db.models import F
from django.conf import settings
from django.utils import timezone
from .models import Export, TrainType
from documents.models import Rating, Document, User

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from surprise import Dataset, Reader, accuracy, SVD, NMF
from surprise.model_selection import cross_validate, train_test_split, GridSearchCV
from .models import Status, Export, UserAction, TrainModelData, TrainType, Suggestion
from django.contrib.contenttypes.models import ContentType

logger = get_task_logger(__name__)
BASE_PATH = settings.MODELS_DATA_ROOT


def load_model():
    try:
        model_output_path = os.path.join(BASE_PATH, "cf-model.pkl")
        with open(model_output_path, "rb") as f:
            loaded_algo_data = pickle.load(f)
            loaded_algo = loaded_algo_data.get('model')
        return True, loaded_algo
    except Exception as error:
        logger.error(f"Error {error}")
        return False, None


def save_model(algo_data: dict):
    try:
        model_output_path = os.path.join(BASE_PATH, "cf-model.pkl")
        logger.info(f"model_output_path = {model_output_path}")
        # if os.path.exists(model_output_path):
        #     os.remove(model_output_path)
        with open(model_output_path, "wb") as f:
            pickle.dump(algo_data, f)
        return True, model_output_path
    except Exception as error:
        logger.error(f"Error {error}")
        return False, None


def save_cf_pd_dataset(documents: Document):
    try:
        last_export_obj = Export.objects.filter(
            train_type=TrainType.COLLABORATIVE,
        ).last()
        if last_export_obj and last_export_obj.file:
            prev_dataset = pd.read_csv(last_export_obj.file.name)
            doc_ids_unique = prev_dataset['document_id'].unique()
            user_ids_unique = prev_dataset['user_id'].unique()
            # if Rating.objects.exclude(user_id__in=user_ids_unique, document_id__in=doc_ids_unique).count() 
            #     return
        export_obj = Export.objects.create(
            train_type=TrainType.COLLABORATIVE,
        )
        model_output_path = os.path.join(
            BASE_PATH, f"{export_obj.pk}_{export_obj.train_type}_dataset.csv")
        rating_qs = Rating.objects.filter(document__in=documents).annotate(
            rating=F('value')).values('id', 'user_id', 'document_id', 'rating')
        df = pd.DataFrame(rating_qs)
        df.to_csv(model_output_path, index=False)
        export_obj.file.name = model_output_path
        export_obj.save()
        return True, export_obj
    except Exception as error:
        logger.error(f"Error {error}")
        return False, None


def save_cb_pd_dataset(documents):
    try:
        last_export_obj = Export.objects.filter(
            train_type=TrainType.CONTENT_BASED,
        ).last()
        if last_export_obj and last_export_obj.file:
            prev_dataset = pd.read_csv(last_export_obj.file.name)
            doc_ids_unique = prev_dataset['id'].unique()
            if Document.objects.exclude(id__in=doc_ids_unique).count() == 0:
                return
        export_obj = Export.objects.create(
            train_type=TrainType.CONTENT_BASED,
        )
        model_output_path = os.path.join(
            BASE_PATH, f"{export_obj.pk}_{export_obj.train_type}_dataset.csv")
        df = pd.DataFrame(documents.values('id', 'title', 'description'))
        df.to_csv(model_output_path, index=False)
        export_obj.file.name = model_output_path
        export_obj.save()
        return True, export_obj
    except Exception as error:
        logger.error(f"Error {error}")
        return False, None


class CollaborativeFilteringModel:
    CV = 4
    verbose = True

    def train(self, export_obj: Export):
        train_model_obj = TrainModelData.objects.create(
            status=Status.PROCESSING,
            train_type=TrainType.COLLABORATIVE,
            export=export_obj,
        )
        try:
            logger.info(f"pd.read_csv(\'{export_obj.file.name}\')")
            df = pd.read_csv(export_obj.file.name)
            df['rating'].dropna(inplace=True)

            train_model_obj.documents_involved.set(
                Document.objects.filter(id__in=df['document_id'].to_list()))
            train_model_obj.users_involved.set(
                User.objects.filter(id__in=df['user_id'].to_list()))

            reader = Reader(rating_scale=(1, 5))
            data = Dataset.load_from_df(
                df[["user_id", "document_id", "rating"]], reader)
            algo = SVD(verbose=True, n_epochs=20)
            logger.info(f"Start cross validation start with cv={self.CV}")
            cross_validate(algo, data, measures=[
                'RMSE', 'MAE'], cv=self.CV, verbose=self.verbose)
            trainset = data.build_full_trainset()
            logger.info(f"Start algo.fit(trainset)")
            algo.fit(trainset)
            testset = trainset.build_testset()
            logger.info(f"Start algo.test(testset)")
            predictions = algo.test(testset)

            accuracy_rmse = accuracy.rmse(predictions)
            accuracy_mae = accuracy.mae(predictions)

            logger.info(f"accuracy: RMSE={accuracy_rmse}, MAE={accuracy_mae}")

            algo_data = {"model": algo}

            ret, model_output_path = save_model(algo_data)

            train_model_obj.description = json.dumps({
                "RMSE": accuracy_rmse,
                "MAE": accuracy_mae,
            })
            train_model_obj.file = model_output_path
            train_model_obj.status = Status.COMPLETED
            train_model_obj.save()

            logger.info('Training (collaborative filtering) with RMSE={0} MAE={1}; and saved to {2}'.format(
                accuracy_mae, accuracy_rmse, model_output_path))
        except Exception as err:
            train_model_obj.status = Status.ERROR
            train_model_obj.description = json.dumps({
                "error": str(err),
            })
            train_model_obj.save()

    def batch_user_predictions(self, start_page=0, offset=250, model=None):
        if model is None:
            ret, model = load_model()
            if not ret:
                return
        document_ids = Document.objects.order_by('-rating_avg').values_list(
            'id', flat=True)[start_page:start_page+offset]  # implement popular
        user_ids = User.objects.values_list('id', flat=True)  # dilter receny
        t1 = time.time()
        new_suggestions_data = []
        to_delete_suggestions_ids = []

        yesterday = timezone.now() - timezone.timedelta(days=1)
        for doc_id in document_ids:
            ctype = ContentType.objects.get_for_model(User)
            recent_suggestions_vals = Suggestion.objects.filter(
                train_type=TrainType.COLLABORATIVE, document_id=doc_id).values("id", "object_id", "rating_value")
            # created_at__gte=yesterday,
            recent_suggestions_vals_ids: list[int] = [
                i["id"] for i in recent_suggestions_vals]
            recent_suggestions_vals_object_ids: list[int] = [
                i["object_id"] for i in recent_suggestions_vals]
            recent_suggestions_vals_rating_values: list[int] = [
                i["rating_value"] for i in recent_suggestions_vals]
            for user_id in user_ids:
                pred = model.predict(uid=user_id, iid=doc_id).est
                if user_id in recent_suggestions_vals_object_ids:
                    index = recent_suggestions_vals_object_ids.index(user_id)
                    if recent_suggestions_vals_rating_values[index] == pred:
                        continue
                    else:
                        to_delete_suggestions_ids.append(
                            recent_suggestions_vals_ids[index])
                data = {
                    'content_type': ctype,
                    'object_id': user_id,
                    'document_id': doc_id,
                    'rating_value': pred,
                    'train_type': TrainType.COLLABORATIVE,
                }
                new_suggestions_data.append(
                    Suggestion(**data)
                )
        t2 = time.time()
        logger.info(f"{len(new_suggestions_data)} in {t2-t1} seconds")
        Suggestion.objects.filter(id__in=to_delete_suggestions_ids).delete()
        Suggestion.objects.bulk_create(new_suggestions_data)


class ContentBasedFilteringModel:
    # CV = 4
    verbose = True

    def train_and_batch(self, export_obj: Export):
        train_model_obj = TrainModelData.objects.create(
            status=Status.PROCESSING,
            train_type=TrainType.CONTENT_BASED,
            export=export_obj
        )
        try:
            logger.info(f"pd.read_csv(\'{export_obj.file.name}\')")
            df = pd.read_csv(export_obj.file.name)
            # df['description'].dropna(inplace=True)
            df['description'] = df['description'].fillna('')
            df['description'] = df.apply(
                lambda row: row['title'] + ': ' + row['description'], axis=1)

            t1 = time.time()
            logger.info(f"start TfidfVectorizer")

            tfidf = TfidfVectorizer(stop_words='english')
            tfidf_matrix = tfidf.fit_transform(df['description'])
            cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

            logger.info(f"start batch")

            new_suggestions_data = []
            to_delete_suggestions_ids = []

            RECORD_LIMIT = 5
            for i, value in df.iterrows():
                ctype = ContentType.objects.get_for_model(Document)
                recent_suggestions_vals = Suggestion.objects.filter(
                    train_type=TrainType.CONTENT_BASED, object_id=value['id'], content_type=ctype).values("id", "document_id", "rating_value")
                # created_at__gte=yesterday,
                recent_suggestions_vals_ids: list[int] = [
                    i["id"] for i in recent_suggestions_vals]
                recent_suggestions_vals_document_ids: list[int] = [
                    i["document_id"] for i in recent_suggestions_vals]
                recent_suggestions_vals_rating_values: list[int] = [
                    i["rating_value"] for i in recent_suggestions_vals]
                rec_items = self.get_recommendations(
                    df, i, cosine_sim, num_recommend=RECORD_LIMIT)
                rec_items_ids = rec_items['id'].to_list()
                for k, predicted_doc_id in enumerate(rec_items_ids):
                    pred = (RECORD_LIMIT - k) * (5 / RECORD_LIMIT)
                    pred = min(pred, 5.0)
                    if predicted_doc_id in recent_suggestions_vals_document_ids:
                        index = recent_suggestions_vals_document_ids.index(
                            predicted_doc_id)
                        if recent_suggestions_vals_rating_values[index] == pred:
                            continue
                        else:
                            to_delete_suggestions_ids.append(
                                recent_suggestions_vals_ids[index])
                    data = {
                        'content_type': ctype,
                        'object_id': value['id'],
                        'document_id': predicted_doc_id,
                        'rating_value': pred,
                        'train_type': TrainType.CONTENT_BASED,
                    }
                    new_suggestions_data.append(
                        Suggestion(**data)
                    )

            t2 = time.time()
            logger.info(f"{len(new_suggestions_data)} in {t2-t1} seconds")
            Suggestion.objects.filter(
                id__in=to_delete_suggestions_ids).delete()
            Suggestion.objects.bulk_create(new_suggestions_data)

            train_model_obj.documents_involved.set(
                Document.objects.filter(id__in=df['id'].to_list()))

            train_model_obj.status = Status.COMPLETED
            train_model_obj.description = json.dumps({
                "detail": f"Process {df['id'].size} documents",
            })
            train_model_obj.save()

            logger.info('Training (content based) saved to {2}')
        except Exception as err:
            train_model_obj.status = Status.ERROR
            train_model_obj.description = json.dumps({
                "error": str(err),
            })
            train_model_obj.save()

    def get_recommendations(self, df, idx: int, cosine_sim, num_recommend=10) -> pd.DataFrame:
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        top_similar = sim_scores[1:num_recommend+1]
        doc_indices = [i[0] for i in top_similar]
        return df.iloc[doc_indices]
