from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

admin.site.register(City)
admin.site.register(State)
admin.site.register(Patient)
admin.site.register(Country)
admin.site.register(User)
admin.site.register(Clinic)
admin.site.register(Doctor)
