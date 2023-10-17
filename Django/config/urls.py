from django.urls import path, include
from django.shortcuts import redirect  # Import the redirect function
import requests

urlpatterns = [
    path('dataCenter/', include('dataCenter.urls')),
    path('', lambda request: redirect('dataCenter/')),  # Redirect root URL to dataCenter/
]
