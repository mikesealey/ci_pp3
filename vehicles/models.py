from django.db import models
from django.contrib.auth.models import User


class Vehicle(models.Model):
    vrn = models.CharField(max_length=10, unique=True)
    make = models.CharField(max_length=25, unique=False)
    model = models.CharField(max_length=25, unique=False)
    engine_capacity = models.CharField(max_length=25, unique=False)
    fuel_type = models.CharField(max_length=25, unique=False)
    year_of_manufacture = models.CharField(max_length=4, unique=False)
    colour = models.CharField(max_length=15, unique=False)
    owner = models.ForeignKey(
        User,
        related_name="vehicles",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        )

# on_delete=models.SET_NULL will _not_ delete the vehicle history if the owner
# deletes their account.
# This will be important if a vehicle is sold to a different user.
# null=true and blank=true allow empty or null values in these cases
