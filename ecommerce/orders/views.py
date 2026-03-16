from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer

import razorpay
from django.conf import settings


# -------------------------
# CART VIEWSET
# -------------------------

class CartViewSet(viewsets.ModelViewSet):

    queryset = Cart.objects.all()
    serializer_class = CartSerializer



# -------------------------
# CART ITEM VIEWSET
# -------------------------

class CartItemViewSet(viewsets.ModelViewSet):

    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CartItem.objects.filter(cart__user=self.request.user)
        return CartItem.objects.none()

    def create(self, request, *args, **kwargs):

        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        cart, _ = Cart.objects.get_or_create(user=request.user)

        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        try:

            cart_item = CartItem.objects.get(
                cart=cart,
                product_id=product_id
            )

            cart_item.quantity += quantity
            cart_item.save()

            serializer = self.get_serializer(cart_item)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        except CartItem.DoesNotExist:

            data = {
                "cart": cart.id,
                "product": product_id,
                "quantity": quantity
            }
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )



# -------------------------
# ORDER VIEWSET (ORDER HISTORY)
# -------------------------

class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get("user_id")
        if user_id:
            return Order.objects.filter(user_id=user_id).order_by("-created_at")
        return Order.objects.all().order_by("-created_at")



# -------------------------
# CHECKOUT API
# -------------------------

@api_view(["POST"])
def checkout(request, user_id):

    cart = Cart.objects.filter(user_id=user_id).first()

    if not cart:

        return Response(
            {"error": "Cart not found"},
            status=status.HTTP_404_NOT_FOUND
        )


    cart_items = CartItem.objects.filter(cart=cart)

    if not cart_items.exists():

        return Response(
            {"error": "Cart is empty"},
            status=status.HTTP_400_BAD_REQUEST
        )


    # -------------------------
    # STOCK VALIDATION
    # -------------------------

    for item in cart_items:

        if item.product.stock < item.quantity:

            return Response(
                {"error": f"Not enough stock for {item.product.name}"},
                status=status.HTTP_400_BAD_REQUEST
            )


    # -------------------------
    # TOTAL CALCULATION
    # -------------------------

    total_price = sum(
        item.product.price * item.quantity
        for item in cart_items
    )


    # -------------------------
    # CREATE ORDER
    # -------------------------

    order = Order.objects.create(
        user_id=user_id,
        total_price=total_price
    )


    # -------------------------
    # CREATE ORDER ITEMS
    # -------------------------

    for item in cart_items:

        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )


        # Reduce stock
        product = item.product
        product.stock -= item.quantity
        product.save()


    # -------------------------
    # CLEAR CART
    # -------------------------

    cart_items.delete()


    return Response(
        {
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_price": total_price
        },
        status=status.HTTP_201_CREATED
    )



# -------------------------
# CREATE RAZORPAY PAYMENT ORDER
# -------------------------

@api_view(["POST"])
def create_payment(request):

    amount = request.data.get("amount")

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    payment = client.order.create({

        "amount": int(amount) * 100,  # Razorpay uses paise
        "currency": "INR",
        "payment_capture": "1"

    })

    return Response({

        "id": payment["id"],
        "amount": payment["amount"],
        "currency": payment["currency"],
        "key": settings.RAZORPAY_KEY_ID

    })