from django.shortcuts import render
from django.http import HttpResponse
from .models import Booking, Vehicle
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


# Create your views here.
@login_required
def bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    return render(request, "bookings/bookings.html", {"bookings": bookings})

@csrf_exempt
@login_required
def delete_booking(request, booking_id):
    if request.method == "POST":
        try:   
            booking = Booking.objects.get(id=booking_id, user=request.user)
            booking.delete()
            return JsonResponse({"status": "ok", "deleted_booking_id": booking_id})
        except Booking.DoesNotExist:
            return JsonResponse({"error": "Booking not found"}, status=404)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

@login_required
def get_bookings_list(request):
    bookings = Booking.objects.filter(user=request.user)
    return render(request, "bookings/bookings_list.html", {"bookings": bookings})

@csrf_exempt
@login_required
def add_booking(request):
    if request.method == "POST":
        data = json.loads(request.body)

        # Fetch the vehicle associated with this booking
        vehicle_id = data.get("vehicle")
        try:
            vehicle = Vehicle.objects.get(pk=vehicle_id)
        except Vehicle.DoesNotExist:
            return JsonResponse({"error": "Vehicle not found"}, status = 404)
        
        booking = Booking.objects.create(
            date_time = data.get("dateTime"),
            booking_type = data.get("bookingType"),
            customer_notes = data.get("customerNotes"),
            vehicle_mileage_at_service = data.get("vehicle_mileage_at_service"),
            vehicle = vehicle,
            user = request.user
        )
        return JsonResponse({"status": "ok", "booking_id": booking.id})
    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
@login_required
@csrf_exempt
def update_booking(request, booking_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return JsonResponse({"error": "Booking not found"}, status=404)

        booking.booking_type = data.get("bookingType", booking.booking_type)
        booking.date_time = data.get("dateTime", booking.date_time)
        booking.customer_notes = data.get("customerNotes", booking.customer_notes)
        booking.vehicle_mileage_at_service = data.get("vehicle_mileage_at_service", booking.vehicle_mileage_at_service)
        booking.approved = False # Mechanic user will need to review changes to prevent shenanigans

        vehicle_id = data.get("vehicle")
        if vehicle_id:
            try:
                vehicle = Vehicle.objects.get(pk=vehicle_id)
                booking.vehicle = vehicle
            except Vehicle.DoesNotExist:
                return JsonResponse({"error": "Vehicle not found"}, status=404)

        booking.save()
        return JsonResponse({"status": "updated", "booking_id": booking.id})

    return JsonResponse({"error": "Invalid request method"}, status=400)