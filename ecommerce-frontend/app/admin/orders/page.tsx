"use client"

import { useEffect, useState } from "react"
import { fetchOrders, updateOrder } from "../../../lib/admin-api"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const statusOptions = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"]

  useEffect(() => {
    void loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await fetchOrders()
      setOrders(data)
    } catch (err) {
      alert("Error loading orders")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    if (!confirm("Update order status?")) return
    try {
      await updateOrder(id, { status })
      await loadOrders()
    } catch (err) {
      alert("Update failed")
    }
  }

  if (loading) return <div className="py-12 text-center">Loading orders...</div>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <button onClick={loadOrders} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-4 py-4 font-mono text-sm">{order.id}</td>
                  <td className="whitespace-nowrap px-4 py-4">{order.user}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold">Rs. {order.total_price}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
