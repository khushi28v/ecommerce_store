"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { DashboardData, AdminOrder, fetchDashboardData, fetchOrders } from "@/lib/admin-api"

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0)
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboardData, orderData] = await Promise.all([
          fetchDashboardData(),
          fetchOrders(),
        ])

        setDashboard(dashboardData)
        setOrders(orderData)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6)
  }, [orders])

  const statusSummary = useMemo(() => {
    return orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})
  }, [orders])

  const totalSales = dashboard?.total_sales || 0
  const totalOrders = dashboard?.total_orders || 0
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  if (loading) return <div className="py-12 text-center text-[#334155]">Loading dashboard...</div>
  if (error) return <div className="py-12 text-center text-red-600">Error: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Dashboard Overview</h2>
          <p className="text-sm text-[#64748b]">Live snapshot of revenue, orders, and product momentum</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link
            href="/admin/products"
            className="rounded-lg bg-[#0b5ed7] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#0a4fb7]"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-lg border border-[#cbd5e1] px-4 py-2 text-center text-sm font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#dbe5f0] bg-[#f8fbff] p-5">
          <p className="text-sm text-[#64748b]">Total Sales</p>
          <p className="mt-1 text-3xl font-bold text-[#0369a1]">{formatMoney(totalSales)}</p>
        </article>

        <article className="rounded-xl border border-[#dbe5f0] bg-[#f8fffb] p-5">
          <p className="text-sm text-[#64748b]">Total Orders</p>
          <p className="mt-1 text-3xl font-bold text-[#15803d]">{totalOrders}</p>
        </article>

        <article className="rounded-xl border border-[#dbe5f0] bg-[#fffdfa] p-5">
          <p className="text-sm text-[#64748b]">Average Order Value</p>
          <p className="mt-1 text-3xl font-bold text-[#b45309]">{formatMoney(avgOrderValue)}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#dbe5f0] p-5">
          <h3 className="mb-4 text-lg font-semibold text-[#0f172a]">Top Products</h3>
          <div className="space-y-3">
            {dashboard?.top_products?.length ? (
              dashboard.top_products.map((product) => (
                <div key={product.product__name} className="flex items-center justify-between rounded-lg bg-[#f8fafc] px-3 py-2">
                  <div>
                    <p className="font-medium text-[#1e293b]">{product.product__name}</p>
                    <p className="text-xs text-[#64748b]">{product.order_count} orders</p>
                  </div>
                  <span className="text-sm font-semibold text-[#0f766e]">{formatMoney(product.total_sales)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#64748b]">No product sales data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#dbe5f0] p-5">
          <h3 className="mb-4 text-lg font-semibold text-[#0f172a]">Order Status Mix</h3>
          <div className="space-y-3">
            {Object.keys(statusSummary).length ? (
              Object.entries(statusSummary).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-lg bg-[#f8fafc] px-3 py-2">
                  <span className="text-sm font-medium text-[#334155]">{status}</span>
                  <span className="rounded-full bg-[#e2e8f0] px-2 py-0.5 text-xs font-semibold text-[#0f172a]">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#64748b]">No orders found yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#dbe5f0] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0f172a]">Recent Orders</h3>
          <Link href="/admin/orders" className="text-sm font-medium text-[#0b5ed7] hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#64748b]">No recent orders to show.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-left text-[#64748b]">
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">User</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#f1f5f9] text-[#1e293b]">
                    <td className="py-2 pr-4 font-mono">#{order.id}</td>
                    <td className="py-2 pr-4">{order.user}</td>
                    <td className="py-2 pr-4">{order.status}</td>
                    <td className="py-2 pr-4 font-semibold">{formatMoney(order.total_price)}</td>
                    <td className="py-2">{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
