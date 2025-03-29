from django.db import models
from django.contrib.auth.models import User
from vehicles.models import Vehicle

# Create your models here.
class Booking(models.Model):
    SERVICE = "Service"
    MOT = "MOT"
    REPAIR = "Repair"
    OTHER = "Other"

    BOOKING_TYPE_CHOICES = [
        (SERVICE, "Service"),
        (MOT, "MOT"),
        (REPAIR, "Repair"),
        (OTHER, "Other"),
    ]

    date_time = models.DateTimeField()
    approved = models.BooleanField(default=False)
    booking_type = models.CharField(max_length=10, choices=BOOKING_TYPE_CHOICES)
    customer_notes = models.TextField(max_length=1000)
    mechanics_notes = models.TextField(max_length=1000, null=True, blank=True)
    vehicle_mileage_at_service = models.PositiveIntegerField()
    completed_service = models.BooleanField(default=False)
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )