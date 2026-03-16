from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, MyTokenObtainPairSerializer
from products.models import Product
from products.serializers import ProductSerializer
from orders.models import Order, OrderItem
from orders.serializers import OrderSerializer
from django.db.models import Sum, Count


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class TokenView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class AdminProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]


class AdminOrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
        total_orders = Order.objects.count()
        top_products = OrderItem.objects.values('product__name').annotate(
            total_sales=Sum('price'), 
            order_count=Count('id')
        ).order_by('-total_sales')[:5]
        return Response({
            'total_sales': float(total_sales),
            'total_orders': total_orders,
            'top_products': list(top_products),
        })
