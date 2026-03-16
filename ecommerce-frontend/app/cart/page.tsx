"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function CartPage() {
  const [items, setItems] = useState<any[]>([])

  const loadCart = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

      const cartRes = await fetch("http://127.0.0.1:8000/api/orders/cart-items/", { headers })
      if (!cartRes.ok) return
      const cartData = await cartRes.json()

      const itemsWithProducts = await Promise.all(
        cartData.map(async (item: any) => {
          const productRes = await fetch(`http://127.0.0.1:8000/api/products/${item.product}/`)
          const product = productRes.ok ? await productRes.json() : null
          return { ...item, product }
        })
      )

      setItems(itemsWithProducts.filter((item) => item.product))
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  useEffect(() => {
    void loadCart()
  }, [])

  const increase = async (item: any) => {
    await fetch(`http://127.0.0.1:8000/api/orders/cart-items/${item.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ quantity: item.quantity + 1 }),
    })
    void loadCart()
  }

  const decrease = async (item: any) => {
    if (item.quantity <= 1) return

    await fetch(`http://127.0.0.1:8000/api/orders/cart-items/${item.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ quantity: item.quantity - 1 }),
    })
    void loadCart()
  }

  const removeItem = async (item: any) => {
    await fetch(`http://127.0.0.1:8000/api/orders/cart-items/${item.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    void loadCart()
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  const deliveryFee = subtotal < 499 ? 40 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-[#F5F8F5] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-[#020402] sm:mb-10 sm:text-4xl">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-[#758173]">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
            <div className="space-y-4 lg:col-span-2 sm:space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#E8F0E8] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                >
                  <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded object-cover" />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-[#020402] sm:text-lg">{item.product.name}</h2>
                    <p className="text-[#758173]">Rs. {item.product.price}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-start">
                    <div className="flex items-center overflow-hidden rounded-lg border border-[#B8D2B3]">
                      <button onClick={() => decrease(item)} className="bg-[#C5EFCB] px-3 py-2" aria-label="Decrease quantity">
                        -
                      </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button onClick={() => increase(item)} className="bg-[#C5EFCB] px-3 py-2" aria-label="Increase quantity">
                        +
                      </button>
                    </div>

                    <button onClick={() => removeItem(item)} className="text-sm text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-xl border border-[#E8F0E8] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-5 text-xl font-semibold">Order Summary</h2>

              <div className="mb-6 space-y-2 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span className="line-clamp-1">{item.product.name} x {item.quantity}</span>
                    <span>Rs. {item.quantity * item.product.price}</span>
                  </div>
                ))}
              </div>

              <hr className="mb-4" />

              <div className="mb-3 flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>

              <div className="mb-4 flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">{deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}</span>
              </div>

              <hr className="mb-4" />

              <div className="mb-5 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>

              <p className="mb-4 text-sm text-gray-500">Free delivery on orders above Rs. 499</p>

              <Link href="/checkout" className="block">
                <button className="w-full rounded-lg bg-[#647A67] py-3 text-white transition hover:bg-[#3C433B]">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
