"""
URL configuration for AutoMate project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from vehicles.views import vehicles
from bookings.views import bookings
from AutoMate.views import homepage, profile, signup
from accounts.views import profile_view
from AutoMate import views as core_views
from .views import profile
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('vehicles/', include("vehicles.urls")),
    path('bookings/', include("bookings.urls")),
    
    path('', homepage, name='homepage'),
    path('profile/', profile_view, name='profile'),
    path('accounts/', include('allauth.urls')),

    path('login/', auth_views.LoginView.as_view(template_name='account/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='homepage'), name='logout'),
    path('signup/', lambda request: redirect('account_signup')),

]

handler404 = 'AutoMate.views.custom_404_view'