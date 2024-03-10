# %%
from mlrec.utils import *
from mlrec.tasks import *
from django.contrib.auth.hashers import make_password
from mlrec.models import *
from accounts.models import *
from documents.models import *
import os
import sys
import django
import pandas as pd
import random


def init_django(project_name=None):
    # os.chdir(PWD)
    PROJ_MISSING_MSG = "Set an enviroment variable:\n`DJANGO_PROJECT=your_project_name`\nor call:\n`init_django(your_project_name)`"
    project_name = project_name or os.environ.get('DJANGO_PROJECT') or None
    if project_name 
        raise Exception(PROJ_MISSING_MSG)
    # sys.path.insert(0, os.getenv('PWD'))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'{project_name}.settings')
    os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"
    import django
    django.setup()


# init_django("backend")


def seed():

    input_path_cf = os.path.join(os.path.join(
        os. getcwd(), 'seeding'), 'ratigns_seed.csv')
    input_path_cb = os.path.join(os.path.join(
        os. getcwd(), 'seeding'), 'documents_seed.csv')
    input_path_cf, input_path_cb

    # %%

    # %%
    SEED = 1
    if SEED:
        df_cb = pd.read_csv(input_path_cb)
        df_cf = pd.read_csv(input_path_cf)
        print("df_cf.info(), df_cb.info()", df_cf.info(), df_cb.info())

        documents_ids = df_cf['document_id'].unique()
        tmp_df_cf = df_cf.copy().sort_values(by='document_id')[
            0:(df_cb['show_id'].size * 3)]

        print("tmp_df_cf, df_cf", tmp_df_cf, df_cf)
        user_ids = tmp_df_cf['user_id'].unique()
        print("user_ids, user_ids.size", user_ids, user_ids.size)
        data = []
        for i in range(0, user_ids.size):
            idd = user_ids[i]
            data.append(User(
                id=idd,
                username=f"user{idd}",
                email=f"user{idd}@example.com",
                password=make_password(f"user{idd}@password"),
            ))
            if i > 100:
                break
        User.objects.bulk_create(data)
        user_ids = User.objects.order_by('id').values_list('id', flat=True)
        df_cb['id'] = df_cb.index + 1
        filtered_df = df_cf[df_cf['user_id'].isin(user_ids)]
        filtered_df = filtered_df[filtered_df['document_id'].isin(df_cb['id'])]
        filtered_df, df_cb['id'], user_ids[0],  user_ids[len(user_ids)-1]
        filtered_df_cb = df_cb[df_cb['id'].isin(filtered_df['document_id'])]
        # filtered_df_cb.index.size, filtered_df['document_id'].size, filtered_df['document_id'].nunique()
        print("filtered_df_cb, filtered_df_cb['id'].size, filtered_df['document_id'].nunique()",
              filtered_df_cb, filtered_df_cb['id'].size, filtered_df['document_id'].nunique())
        # filtered_df_cb['id'].min(), filtered_df_cb['id'].max()
        # df_cf[df_cf['document_id'].isin(filtered_df_cb['id'])]['document_id'].nunique()
        data = []
        admin_user = User.objects.first()
        course = Course.objects.last()
        subjects = Subject.objects.all()
        for i, value in filtered_df_cb.iterrows():
            data.append(Document(
                id=value['id'],
                title=value['title'],
                description=value['description'],
                owner=admin_user,
                course=course
            ))
        docs = Document.objects.bulk_create(data)
        for doc in docs:
            rand_index = random.choice(list(range(0, len(subjects))))
            doc.subjects.set(subjects[0:rand_index])
        print("Document.objects.last().__dict__, filtered_df_cb.iloc[-1],...", Document.objects.last().__dict__, filtered_df_cb.iloc[-1], filtered_df[filtered_df['document_id']
              
        data = []
        for i, value in filtered_df.iterrows():
            data.append(Rating(
                id=i + 1,
                document_id=value["document_id"],
                value=value["rating"],
                user_id=value["user_id"],
            ))

        print("len(data), data[-1], Rating.objects.all()",
              len(data), data[-1], Rating.objects.all())
        Rating.objects.bulk_create(data)

        from documents.tasks import update_document_ratings
        from mlrec.utils import save_cf_pd_dataset, save_cb_pd_dataset

        update_document_ratings()
        documents = Document.objects.all()
        save_cf_pd_dataset(documents)
        save_cb_pd_dataset(documents)

    # %%
    # from documents.tasks import update_document_ratings
    # a = Document.objects.values('rating_avg','rating_count')
    # update_document_ratings()
    Document.objects.values('rating_avg', 'rating_count')

    # last_train_export = Export.objects.filter(
    #     train_type=TrainType.COLLABORATIVE).last()
    # last_train_model = TrainModelData.objects.filter(
    #     train_type=TrainType.COLLABORATIVE).last()
    # print(last_train_export.__dict__, last_train_model.__dict__)

    # %%
    def batch_user_predictions(start_page=0, offset=250):
        ret, model = load_model()
        if ret:
            document_ids = Document.objects.order_by('-rating_avg').values_list(
                'id', flat=True)[start_page:start_page+offset]  # implement popular
            user_ids = User.objects.order_by(
                '-id').values_list('id', flat=True)[0:10]  # dilter receny
            new_suggestions_data = []
            print(user_ids, document_ids, [
                  i.__dict__ for i in Document.objects.order_by('-rating_avg')])
            for doc_id in document_ids:
                for user_id in user_ids:
                    pred = model.predict(uid=user_id, iid=doc_id).est
                    print("Pred", user_id, doc_id, pred)
    batch_user_predictions(0, 5)
    print("Seed data created successfully.")

# %%
