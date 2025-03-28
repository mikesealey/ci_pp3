from django.urls import path
from .views import bookings

urlpatterns = [
    path("", bookings, name="bookings"),
]