from django.contrib import admin
from django.http import JsonResponse
from django.db.models import Sum, Count
from django.urls import path
from products.models import Product
from orders.models import Order, OrderItem

class EcommerceAdminSite(admin.AdminSite):
    site_header = "Ecommerce Admin Dashboard"
    site_title = "Ecommerce Admin"
    index_title = "Welcome to Ecommerce Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_view(self.dashboard_view), name='dashboard'),
        ]
        return custom_urls + urls

    def dashboard_view(self, request):
        # Basic analytics
        total_sales = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
        total_orders = Order.objects.count()
        top_products = OrderItem.objects.values('product__name').annotate(
            total_sales=Sum('price'), 
            order_count=Count('id')
        ).order_by('-total_sales')[:5]

        context = {
            'total_sales': total_sales,
            'total_orders': total_orders,
            'top_products': list(top_products),
        }
        return JsonResponse(context)

admin.site = EcommerceAdminSite(name='ecommerce_admin')

