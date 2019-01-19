

from django.contrib import admin
from django.urls import path, re_path
from django.contrib.auth import views as auth_views
from . import views 
from django.conf.urls import include
from django.views.generic.base import RedirectView



urlpatterns = [

	path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('appointment', views.form_hos, name='appointment'),
    path('appointment/details', views.past_appt, name='appointment_details'),
    path('appointment/payment', views.payment, name='payment'),
    path('login/user', views.user_login, name='user_login'),
    path('clinic/dashboard', views.clinic_dashboard, name='clinic_dashboard'),
    path('clinic/accepted', views.accepted_patient, name='clinic_accepted'),

    path('api/cities',views.get_cities, name='api_cities'),
    path('api/clinics',views.get_clinics, name='api_clinics'),
    path('api/states',views.get_states, name='api_states'),
    path('receipt/<str:ids>',views.receipt, name='receipt'),

    path('logout/', views.logout_view, name='logout'),
    path('redirect', views.redirect_ac, name='redirect'),
]