from django.shortcuts import render
from django.http import HttpResponse
from .models import Booking

# Create your views here.
def bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    return render(request, "bookings/bookings/html", {"bookings": bookings})