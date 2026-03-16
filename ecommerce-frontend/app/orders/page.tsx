"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { getToken, parseJwt } from "@/lib/auth"

interface Order {
  id: number
  total_price: number
  status: string
  created_at: string
  items: Array<{
    product: { name: string; price: number; image: string }
    quantity: number
    price: number
  }>
}

function getStatusStyles(status: string) {
  const normalized = status.toLowerCase()

  if (normalized.includes("deliver")) return "bg-emerald-100 text-emerald-700 border-emerald-200"
  if (normalized.includes("ship")) return "bg-blue-100 text-blue-700 border-blue-200"
  if (normalized.includes("paid")) return "bg-green-100 text-green-700 border-green-200"
  if (normalized.includes("cancel")) return "bg-red-100 text-red-700 border-red-200"

  return "bg-amber-100 text-amber-700 border-amber-200"
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const token = getToken()

  useEffect(() => {
    void fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const headers: HeadersInit = {}
      const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : token
      let userId = ""

      if (currentToken) {
        headers.Authorization = `Bearer ${currentToken}`
        const payload = parseJwt(currentToken)
        userId = payload?.user_id || payload?.id || ""
      }

      const url = userId
        ? `http://127.0.0.1:8000/api/orders/orders/?user_id=${userId}`
        : "http://127.0.0.1:8000/api/orders/orders/"

      const res = await fetch(url, { headers })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const summary = useMemo(() => {
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0)
    return {
      count: orders.length,
      totalSpent,
      latest: orders[0]?.created_at,
    }
  }, [orders])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7faf7]">
        <div className="spinner mx-auto animate-spin text-[#647A67]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7faf7] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 rounded-2xl border border-[#dce7dc] bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-3xl font-bold text-[#172517] sm:text-4xl">Order History</h1>
          <p className="mt-2 text-sm text-gray-600">Track your recent purchases and current delivery status.</p>

          {orders.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-[#f5faf5] p-3">
                <p className="text-xs text-gray-500">Total Orders</p>
                <p className="text-xl font-bold text-[#26422a]">{summary.count}</p>
              </div>
              <div className="rounded-lg bg-[#f5faf5] p-3">
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-[#26422a]">Rs. {summary.totalSpent.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-[#f5faf5] p-3">
                <p className="text-xs text-gray-500">Latest Order</p>
                <p className="text-sm font-semibold text-[#26422a]">
                  {summary.latest ? new Date(summary.latest).toLocaleDateString() : "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-[#dce7dc] bg-white px-4 py-14 text-center shadow-sm sm:px-6 sm:py-20">
            <h2 className="text-2xl font-semibold text-gray-700">No Orders Yet</h2>
            <p className="mt-2 text-gray-500">Start shopping to see your orders appear here.</p>
            <Link href="/" className="mt-6 inline-flex rounded-lg bg-[#1f241f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#333a33]">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="overflow-hidden rounded-2xl border border-[#dce7dc] bg-white shadow-sm">
                <div className="border-b border-[#edf2ed] bg-[#fafcf9] px-4 py-4 sm:px-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#172517] sm:text-xl">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="rounded-full bg-[#1f241f] px-3 py-1 text-xs font-semibold text-white">
                        Rs. {Number(order.total_price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3 rounded-lg border border-[#ebf1ea] bg-[#fcfdfc] p-3">
                        {item.product.image && (
                          <img
                            src={item.product.image.startsWith("http") ? item.product.image : `http://127.0.0.1:8000${item.product.image}`}
                            alt={item.product.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-semibold text-[#1f2937]">{item.product.name}</h4>
                          <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                          <p className="mt-1 text-sm font-bold text-[#2f5740]">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
