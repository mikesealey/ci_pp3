from django.urls import path
from .views import bookings
from . import views

urlpatterns = [
    path("", bookings, name="bookings"),
    path("api/bookings_list/", views.get_bookings_list, name="bookings_list"),
    path("delete-booking/<int:booking_id>/", views.delete_booking, name="delete_booking"),
    path("api/add-booking/", views.add_booking, name="add_booking"),
    path("api/update-booking/<int:booking_id>/", views.update_booking, name="update-booking"),
    path("all_bookings/", views.all_bookings, name="all_bookings"),
    path("bookings/<int:booking_id>/complete/", views.booking_completed, name="booking_completed"),
]