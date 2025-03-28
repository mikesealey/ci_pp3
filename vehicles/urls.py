from django.urls import path
from .views import vehicles

urlpatterns = [
    path("", vehicles, name="vehicles"),
]