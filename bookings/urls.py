from django.urls import path
from .views import bookings
from . import views

urlpatterns = [
    path("", bookings, name="bookings"),
    path("api/bookings_list/", views.get_bookings_list, name="bookings_list"),
    path("delete-booking/<int:booking_id>/", views.delete_booking, name="delete_booking"),
    path("api/add-booking/", views.add_booking, name="add_booking"),
]