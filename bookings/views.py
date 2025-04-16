from django.shortcuts import render
from django.http import HttpResponse
from .models import Booking
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


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