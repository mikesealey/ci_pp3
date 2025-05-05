from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .models import Vehicle
import json
import os
import requests


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

# Queries DVLA API for vehicle data based on Vehicle Registration Number (VRN)
# Bring in API key from env OR Heroku
try:
    from env import DVLA_API_KEY  # for local development
except ImportError:
    DVLA_API_KEY = os.getenv("DVLA_API_KEY")
@csrf_exempt
@login_required
def query_vehicle(request):
    # Unpick VRN from request
    body = json.loads(request.body)
    registration_number = body.get('registrationNumber')


    url = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles'
    headers = {
        'x-api-key': DVLA_API_KEY,
        'Content-Type': 'application/json'
    }
    data = {
        'registrationNumber': registration_number
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return JsonResponse(response.json())
    else:
        return JsonResponse({'error': 'API request failed'}, status=response.status_code)
    

# "Delete" a vehicle 
# (Never actually deletes a vehicle, only removes the User relationship
# The user percieves it to be deleted, but the mechanics can still see historic service data
@login_required
@csrf_exempt
def delete_vehicle(request):
    if request.method == "POST":
        data = json.loads(request.body)
        vrn = data.get("vrn")
        vehicle = Vehicle.objects.get(vrn=vrn)
        vehicle.owner = None
        vehicle.save()
        return JsonResponse({"status": "success", "message": f"{vrn} owner removed"})
    
    return JsonResponse({"error": "Invalid request"}, status=400)

# Update Vehicle
# Should never allow changes to VRN or, only the other vehicle details/info
@login_required
@csrf_exempt
def update_vehicle(request):
    if request.method == "POST":
        data = json.loads(request.body)
        vrn = data.get("vrn")
        try:
            vehicle = Vehicle.objects.get(vrn=vrn, owner=request.user)
            vehicle.make = data.get("make")
            vehicle.model = data.get("model")
            vehicle.engine_capacity = data.get("engine_capacity")
            vehicle.fuel_type = data.get("fuel_type")
            vehicle.year = data.get("year")
            vehicle.colour = data.get("colour")
            vehicle.save()
            return JsonResponse({"status": "success", "message": f"{vrn} updated!"})
        except Vehicle.DoesNotExist:
            return JsonResponse({"error": "Vehicle not found"}, status=404)

    return JsonResponse({"error": "Invalid request"}, status=400)

@login_required
def get_vehicle_list(request):
    vehicles = Vehicle.objects.filter(owner=request.user)
    return render(request, "vehicles/vehicle_list.html", {"vehicles": vehicles})

@login_required
def get_vehicle_listJSON(request):
    vehicles = Vehicle.objects.filter(owner=request.user)
    data = [
        {
            
            "vrn": vehicle.vrn,
            "make": vehicle.make,
            "model": vehicle.model,
            "engine_capacity": vehicle.engine_capacity,
            "fuel_type": vehicle.fuel_type,
            "year": vehicle.year_of_manufacture,
            "colour": vehicle.colour,
            "id": vehicle.id
        }
        for vehicle in vehicles
    ]
    return JsonResponse({"vehicles": data})