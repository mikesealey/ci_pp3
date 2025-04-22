from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .forms import ProfileForm
from django import forms

# If you already have a UserForm for first/last/email, keep it; otherwise:
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

@login_required
def profile_view(request):
    user_form = UserForm(request.POST or None, instance=request.user)
    profile_form = ProfileForm(request.POST or None, instance=request.user.profile)

    if request.method == 'POST' and user_form.is_valid() and profile_form.is_valid():
        user_form.save()
        profile_form.save()
        return redirect('profile')  # or wherever

    return render(request, 'profile/profile.html', {
        'user_form': user_form,
        'profile_form': profile_form,
    })