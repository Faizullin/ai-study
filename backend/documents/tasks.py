from celery import shared_task
from django.db.models import Avg, Count
from .models import Rating, Document


@shared_task
def update_document_ratings_task():
    ratings = Rating.objects.values('document_id').annotate(average=Avg(
        'value'), count=Count('document_id'))
    for rat in ratings:
        doc = Document.objects.filter(id = rat['document_id'])
        doc.update(
            rating_avg = rat['average'],
            rating_count = rat['count'],
        )




# def calculate_rating(rating: Rating, action: UserAction):
#     rating_weights = {
#         "like": 3,
#         "dislike": -2,
#         "download": 2,
#         "view": 1,
#     }
#     return rating.value + rating_weights[action.type]
