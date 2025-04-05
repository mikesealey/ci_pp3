from django.urls import path
from .views import vehicles
from . import views

urlpatterns = [
    path("", vehicles, name="vehicles"),
    path('api/add-vehicle/', views.add_vehicle, name='add_vehicle'),
]