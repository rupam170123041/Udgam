from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.db import transaction

from main.models import Patient	, User


class PatientSignupForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = ('name', 'gender', 'doctor' , 'father_husband_name','contact' , 'adhaar' , 'epic' , 'pin' , 'email' , 'address' , 'city' , 'age'  , 'clinic')



class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('first_name','last_name','email','password1','password2')

