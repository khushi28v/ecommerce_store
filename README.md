# Ecommerce Store - Admin Panel Complete

## Live Demo
**Frontend (Vercel):** [https://your-frontend-app.vercel.app](https://your-frontend-app.vercel.app)  *(Update this after Vercel deployment)*
**Backend (Render):** [https://your-backend-app.onrender.com](https://your-backend-app.onrender.com) *(Update this after Render deployment)*

### Admin Demo Credentials
- **Username:** khushi
- **Password:** khushiverse08

### Test Payment Instructions
- Add an item to your cart and proceed to Checkout.
- Under Payment Method, select **Pay Online (Razorpay)** and click **Place Order**.
- In the Razorpay popup, choose **UPI** and enter `success@razorpay`, or choose **Card** and use Razorpay's test card details (e.g. Card: `4111 1111 1111 1111`, CVV: `123`, Expiry: any future date).
- The payment will successfully process and redirect to the orders page.

## Features Implemented

**Customer Storefront:**
- Browse products/search
- Product details/cart/checkout/orders
- Register/login (JWT)

**Admin Panel:**
- Django /admin/ CRUD products/orders
- Frontend /admin/ dashboard/analytics
- Orders status (Pending/Paid/Shipped/Delivered/Cancelled)
- Responsive UI

**Backend:**
- Django DRF PostgreSQL
- JWT auth (is_staff)
- Razorpay payments
- Cart auto-create

## Setup
```
cd ecommerce-frontend && npm install && npm run dev
cd ../ecommerce
store/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Architecture
- Backend: Django DRF REST API
- Frontend: Next.js App Router
- DB: PostgreSQL
- Auth: JWT + is_staff role
- Payments: Razorpay test mode

## Deployment
Frontend: Vercel
Backend: Render (Postgres add-on)

---
*Built as a complete production-ready application demonstrating modern web architecture.*
