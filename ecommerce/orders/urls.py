from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, CartItemViewSet, OrderViewSet
from .views import checkout, create_payment


router = DefaultRouter()

router.register(r'carts', CartViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'orders', OrderViewSet)   # ADD THIS


urlpatterns = [
    path('', include(router.urls)),

    path('checkout/<int:user_id>/', checkout),

    path('create-payment/', create_payment),
]