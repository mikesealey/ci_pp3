from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserChangeForm

def homepage(request):
    return render(request, "AutoMate/home.html")

@login_required
def profile(request):
    if request.method == "POST":
        form = UserChangeForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect("homepage")  # Redirect to home after saving
    else:
        form = UserChangeForm(instance=request.user)

    return render(request, "profile/profile.html", {"form": form})

def home(request):
    return render(request, "AutoMate/home.html")