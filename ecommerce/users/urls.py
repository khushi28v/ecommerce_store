from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, TokenView, AdminProductViewSet, AdminOrderViewSet, AdminDashboardView
from rest_framework_simplejwt.views import TokenRefreshView

admin_router = DefaultRouter()
admin_router.register(r'products', AdminProductViewSet)
admin_router.register(r'orders', AdminOrderViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('admin/', include(admin_router.urls)),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
