from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def vehicles(request):
    return HttpResponse("Hello Vehicles!")
