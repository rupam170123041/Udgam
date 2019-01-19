from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
from django.views.generic import RedirectView

urlpatterns = [
    path('',include('main.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('accounts/profile/', RedirectView.as_view(pattern_name='index', permanent=False)),

]