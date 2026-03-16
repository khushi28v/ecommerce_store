from django.db import models
from orders.models import Order


class Payment(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE)

    razorpay_order_id = models.CharField(max_length=255)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order {self.order.id}"