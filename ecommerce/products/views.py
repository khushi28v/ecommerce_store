from rest_framework import viewsets
from django.db.models import Q
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):

    # Optimized with select_related to prevent N+1 queries when serializing category_name
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer

    def get_queryset(self):

        queryset = super().get_queryset()

        search = self.request.query_params.get("search")
        category = self.request.query_params.get("category")

        # Search filter
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )

        # Category filter
        if category:
            queryset = queryset.filter(category_id=category)

        return queryset


class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
