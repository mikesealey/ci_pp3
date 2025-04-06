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
# Bring in API key from env
from env import DVLA_API_KEY
@csrf_exempt
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
    

    