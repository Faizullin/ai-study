from django.urls import path, include
from django.contrib.auth.views import LogoutView
from .views import DiskSpaceView
import json

app_name = 'dashboard'


urlpatterns = [
    path("api/s/auth/logout/", LogoutView.as_view(), name="auth_logout"),
    path("api/s/disk_stats/", DiskSpaceView.as_view(), name="disk_stats"),
]

with open('dashboard/json/urls.json', 'r') as f:
    data = json.loads(f.read())
    for value in data:
        urlpatterns.append(path((value['url']), include(value['file'])))
