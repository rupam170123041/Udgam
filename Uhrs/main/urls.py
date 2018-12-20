from django.urls import path

from . import views


urlpatterns = [
    path('signup/', views.SignUp.as_view(), name='signup'),
    path('profile/', views.form_hos, name='form_hos'),

    path('api/cities',views.get_cities, name='api_cities'),
    path('api/states',views.get_states, name='api_states'),
    path('receipt/<str:ids>',views.receipt, name='receipt'),
]