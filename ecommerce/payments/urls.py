from django.urls import path
from .views import create_payment, verify_payment

urlpatterns = [
    path('create/<int:order_id>/', create_payment),
    path('verify/', verify_payment),
]
