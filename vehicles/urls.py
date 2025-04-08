from django.urls import path
from .views import vehicles
from . import views

urlpatterns = [
    path("", vehicles, name="vehicles"),
    path('api/add-vehicle/', views.add_vehicle, name='add_vehicle'),
    path("api/query-vehicle/", views.query_vehicle, name="query_vehicle"),
    path("api/delete_vehicle/", views.delete_vehicle, name="delete_vehicle"),
]