from allauth.account.forms import SignupForm
from django import forms
from .models import Profile

class CustomSignupForm(SignupForm):
    phone_number = forms.CharField(max_length=20, required=True, label='Mobile number')


    def save(self, request):
        # Saves the user
        user = super().save(request)

        # then attatches their phone number
        profile = user.profile  # thanks to our post_save signal this exists
        profile.phone_number = self.cleaned_data['phone_number']
        profile.save()
        return user

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['phone_number']
        widgets = {
            'phone_number': forms.TextInput(attrs={'placeholder': 'Mobile number'}),
        }