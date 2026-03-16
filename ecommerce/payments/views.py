import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from orders.models import Order
from .models import Payment

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


@api_view(['POST'])
def create_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        amount = int(order.total_price * 100)  # paise

        razorpay_order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "receipt": f"order_{order.id}",
            "payment_capture": 1  # auto capture
        })

        payment = Payment.objects.create(
            order=order,
            razorpay_order_id=razorpay_order['id'],
            amount=order.total_price
        )

        return Response({
            "razorpay_order_id": razorpay_order['id'],
            "amount": razorpay_order['amount'],
            "currency": razorpay_order['currency'],
            "key": settings.RAZORPAY_KEY_ID
        })
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)


@api_view(['POST'])
def verify_payment(request):
    try:
        razorpay_payment_id = request.data['razorpay_payment_id']
        razorpay_order_id = request.data['razorpay_order_id']
        razorpay_signature = request.data['razorpay_signature']
        
        payment = Payment.objects.get(razorpay_order_id=razorpay_order_id)
        
        # Verify signature
        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })
        
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'Success'
        payment.save()
        
        payment.order.status = 'Paid'
        payment.order.save()
        
        return Response({"status": "success", "message": "Payment verified and order marked as Paid"})
    except Payment.DoesNotExist:
        return Response({"error": "Payment record not found"}, status=404)
    except Exception as e:
        return Response({"error": f"Verification failed: {str(e)}"}, status=400)
