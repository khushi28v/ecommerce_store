from django.contrib import admin
from django.utils.html import format_html
from .models import Cart, CartItem, Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'user')
    search_fields = ('id', 'user__username')
    list_editable = ('status',)
    readonly_fields = ('created_at',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('user')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order__status',)
    search_fields = ('product__name', 'order__id')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    search_fields = ('user__username',)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity')
    list_filter = ('cart__user',)
    search_fields = ('product__name',)
