from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)





@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_available', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('name', 'description')
    list_editable = ('price', 'stock')
    readonly_fields = ('created_at',)

    def is_available(self, obj):
        return obj.stock > 0
    is_available.boolean = True
    is_available.short_description = 'In Stock'
