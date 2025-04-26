from django.shortcuts import render
from django.http import HttpResponse
from .models import Booking, Vehicle
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from datetime import datetime
from django.core.mail import EmailMessage
import traceback
from django.contrib.admin.views.decorators import staff_member_required

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
    return render(request, "bookings/api/bookings_list.html", {"bookings": bookings})

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
        try:
            send_booking_creation_email(booking)
            # send_test_email()
        except Exception as e:
            print("Email sending failed:", e)
            traceback.print_exc()
        return JsonResponse({"status": "ok", "booking_id": booking.id})
    return JsonResponse({"error": "Invalid request"}, status=400)

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

# All bookings _page_
@staff_member_required
def all_bookings_page(request):
    bookings = Booking.objects.all().order_by('date_time')
    return render(request, "bookings/customer_bookings.html", {"bookings": bookings})

# Will get ALL bookings, (not by customer/user) sorted by Date
@staff_member_required
def all_bookings_list(request):
    bookings = Booking.objects.all().order_by('date_time')
    return render(request, "bookings/customer_bookings_list.html", {"bookings": bookings})

# Will allow Mechanic to update with "completed" and "mechanic's notes"
@staff_member_required
def booking_completed(request, booking_id):
    if request.method == "PUT":
        data = json.loads(request.body)
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return JsonResponse({"error": "Booking not found"}, status=404)

        booking.completed_service = True
        booking.mechanics_notes = data.get("mechanicsNotes")
        booking.save()

        return JsonResponse({"status": "booking marked complete", "booking_id": booking.id})

    return JsonResponse({"error": "Invalid request method"}, status=400)

# Mechanic/Staff Approves booking
@csrf_exempt
@staff_member_required
def approve_booking(request, booking_id):
    if request.method == "PUT":
        try:
            bookingData = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return JsonResponse({"error": "Booking not found"}, status=404)

        bookingData.approved = True
        bookingData.save()
        send_booking_confirmation_email(bookingData)

        return JsonResponse({
            "status": "booking marked complete",
            "booking_id": bookingData.id,
            "approved": bookingData.approved,
        })

    return JsonResponse({"error": "Invalid request method"}, status=400)


############ SENDING EMAILS #######

# User creates booking
def send_booking_creation_email(booking):
    subject = "News about your AutoMate booking"
    message = f"""Hi {booking.user.first_name},

    Your booking for your vehicle, {booking.vehicle.vrn} {booking.vehicle.make} {booking.vehicle.model} for {booking.date_time} has been sent to our team of mechanics for review.

    Once the mechanic has reviewed and approved your booking you will recieve a confirmation email.

    Thank you for choosing AutoMate!

    """
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[booking.user.email, ],
        bcc=["mikesealey@hotmail.com"],  # BCC Should go to Mechanic
    )
    email.send(fail_silently=False)

# Mechanic approves booking
def send_booking_confirmation_email(booking):
    print("sending booking confirmaton email")
    subject = "Your AutoMate Service Booking Confirmation"
    message = f"""Hi {booking.user.first_name},

    Your booking for your vehicle, {booking.vehicle.vrn} {booking.vehicle.make} {booking.vehicle.model} for {booking.date_time} has been approved by our team of mechanics.

    Please arrive promptly, using one of the parking spaces marked "Service". Head into reception and speak to one of our staff members.

    Thank you for choosing AutoMate!

    """
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[booking.user.email, ],
        bcc=["mikesealey@hotmail.com"],  # BCC Should go to Mechanic
    )
    email.send(fail_silently=False)

# Mechanic Completes booking
def send_post_service_email(booking):
    subject = "Your AutoMate Booking has been completed"
    message = f"""Hi {booking.user.first_name},

    Your booking for your vehicle, {booking.vehicle.vrn} {booking.vehicle.make} {booking.vehicle.model} has been completed.

    Your notes:
    {booking.customer_notes}

    Mechanic's nots:
    {booking.mechanics_notes}

    Thank you for choosing AutoMate!

    """
    email = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[booking.user.email],
        bcc=["mikesealey@hotmail.com"],  # BCC Should go to Mechanic
    )
    email.send(fail_silently=False)

def send_test_email():
    email = EmailMessage(
        subject = "test AutoMate email",
        body = "If you recieved this, you win!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=["mikesealey@hotmail.com"],
        cc=["mike.sealey@hotmail.com"],
        bcc=["mikesealey@hotmail.com"]

    )
    email.send(fail_silently=False)

