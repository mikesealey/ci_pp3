from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Vehicle
import json

# Create your views here.
# Gets all vehicles of currently-logged-in user
def vehicles(request):
    vehicles = Vehicle.objects.filter(owner=request.user)
    return render(request, "vehicles/vehicles.html", {"vehicles": vehicles})

# adds a vehicle
@login_required
@csrf_exempt
def add_vehicle(request):
    if request.method == "POST":
        data = json.loads(request.body)
        vehicle = Vehicle.objects.create(
            vrn=data.get("vrn"),
            make=data.get("make"),
            model=data.get("model"),
            engine_capacity=data.get("engine_capacity"),
            fuel_type=data.get("fuel_type"),
            year_of_manufacture=data.get("year"),
            colour=data.get("colour"),
            owner=request.user
        )
        return JsonResponse({"status": "ok", "vehicle_id": vehicle.id})
    return JsonResponse({"error": "Invalid request"}, status=400)