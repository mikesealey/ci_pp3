from django.urls import path, include
from .views import vehicles
from . import views

urlpatterns = [
    path("", vehicles, name="vehicles"),
    path('api/add-vehicle/', views.add_vehicle, name='add_vehicle'),
    path("api/query-vehicle/", views.query_vehicle, name="query_vehicle"),
    path("api/delete_vehicle/", views.delete_vehicle, name="delete_vehicle"),
    path("api/update_vehicle/", views.update_vehicle, name="update_vehicle"),
    path("api/vehicle-list/", views.get_vehicle_list, name="vehicle_list"),
    path("api/vehicle-listJSON/", views.get_vehicle_listJSON, name="vehicle_listJSON"),
]