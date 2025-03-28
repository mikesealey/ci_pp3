from django.shortcuts import render
from django.http import HttpResponse
from .models import Vehicle

# Create your views here.
def vehicles(request):
    vehicles = Vehicle.objects.filter(owner=request.user)
    return render(request, "vehicles/vehicles.html", {"vehicles": vehicles})
