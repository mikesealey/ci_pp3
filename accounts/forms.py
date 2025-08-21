from allauth.account.forms import SignupForm
from django import forms
from .models import Profile


class CustomSignupForm(SignupForm):
    first_name = forms.CharField(
        max_length=30,
        required=True,
        label='First name'
        )
    last_name = forms.CharField(
        max_length=30,
        required=True,
        label='Last name'
        )
    phone_number = forms.CharField(
        max_length=20,
        required=True,
        label='Mobile number'
        )

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()

        profile = user.profile
        profile.phone_number = self.cleaned_data['phone_number']
        profile.save()
        return user


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['phone_number']
        widgets = {
            'phone_number': forms.TextInput(
                attrs={
                    'placeholder': 'Mobile number',
                    'required': 'required'
                    }),
        }
