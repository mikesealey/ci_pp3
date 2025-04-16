from django.urls import path
from .views import bookings
from . import views

urlpatterns = [
    path("", bookings, name="bookings"),
    path("delete-booking/<int:booking_id>/", views.delete_booking, name="delete_booking"),

]