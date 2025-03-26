from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def bookings(request):
    return HttpResponse("Hello Bookings!")