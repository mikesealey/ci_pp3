from django.urls import path
from .views import bookings
from . import views

urlpatterns = [
    path("", bookings, name="bookings"),
    path("api/bookings_list/", views.get_bookings_list, name="bookings_list"),
    path("delete-booking/<int:booking_id>/", views.delete_booking, name="delete_booking"),
    path("api/add-booking/", views.add_booking, name="add_booking"),
    path("api/update-booking/<int:booking_id>/", views.update_booking, name="update-booking"),
    path("all_bookings/", views.all_bookings_page, name="all_bookings_page"),
    path("api/all_bookings/", views.all_bookings_list, name="all_bookings_list"),
    path("<int:booking_id>/complete/", views.booking_completed, name="booking_completed"),
    path("api/approve_booking/<int:booking_id>/", views.approve_booking, name="approve_booking"),
    path("fragment/", views.bookings_list_fragment, name="bookings_list_fragment"),
]
