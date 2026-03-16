"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { parseJwt } from "@/lib/auth"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [pincode, setPincode] = useState("")
  const [payment, setPayment] = useState("cod")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const payOnline = async () => {
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      let userId = ""
      if (token) {
        const payload = parseJwt(token)
        userId = payload?.user_id || payload?.id || ""
      }

      const orderRes = await fetch(`http://127.0.0.1:8000/api/orders/checkout/${userId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address, city, pincode, payment_method: payment }),
      })

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}))
        alert(errData.error || "Failed to create order")
        return
      }
      const orderData = await orderRes.json()

      const paymentRes = await fetch(`http://127.0.0.1:8000/api/payments/create/${orderData.order_id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!paymentRes.ok) {
        alert("Failed to initialize payment")
        return
      }
      const data = await paymentRes.json()

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded")
        return
      }

      const options = {
        key: "rzp_test_SRutoUux1VpE2Z",
        amount: data.amount,
        currency: "INR",
        name: "Seatera Store",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        handler: async function (response: any) {
          await fetch("http://127.0.0.1:8000/api/payments/verify/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          alert("Payment successful and verified")
          router.push("/orders")
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert("Payment failed")
    } finally {
      setLoading(false)
    }
  }

  const placeOrder = async () => {
    if (!address || !city || !pincode) {
      alert("Please fill shipping address")
      return
    }

    if (payment === "online") {
      void payOnline()
      return
    }

    setLoading(true)

    const token = localStorage.getItem("token")
    let userId = ""
    if (token) {
      const payload = parseJwt(token)
      userId = payload?.user_id || payload?.id || ""
    }

    const res = await fetch(`http://127.0.0.1:8000/api/orders/checkout/${userId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address, city, pincode, payment_method: payment }),
    })

    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      setMessage(`Order placed successfully! Order ID: ${data.order_id}`)
      setTimeout(() => {
        router.push("/")
      }, 2000)
      return
    }

    const errData = await res.json().catch(() => ({}))
    setMessage(errData.error || "Order failed")
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="mb-8 text-3xl font-bold sm:mb-10">Checkout</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          <div className="rounded-lg border bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>

            <div className="flex flex-col gap-4">
              <input
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded border p-3"
              />

              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded border p-3"
              />

              <input
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="rounded border p-3"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-white p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input type="radio" value="cod" checked={payment === "cod"} onChange={(e) => setPayment(e.target.value)} />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-2">
                <input type="radio" value="online" checked={payment === "online"} onChange={(e) => setPayment(e.target.value)} />
                Pay Online (Razorpay)
              </label>
            </div>

            {payment === "online" && (
              <p className="mt-3 text-sm text-gray-500">Secure payment via Razorpay (UPI / Card / Net Banking)</p>
            )}

            <button
              onClick={placeOrder}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-[#647A67] py-3 text-white hover:bg-[#3C433B] disabled:opacity-60"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

            {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
          </div>
        </div>
      </div>
    </>
  )
}
