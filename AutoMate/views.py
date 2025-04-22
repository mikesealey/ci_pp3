from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth import login

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

def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect("homepage")
    else:
        form = UserCreationForm()
    return render(request, "account/signup.html", {"form": form})

def custom_404_view(request, exception):
    return render(request, "404.html", status=404)