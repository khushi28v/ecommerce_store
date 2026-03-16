"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { isAdmin } from "@/lib/auth"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const authorized = typeof window !== "undefined" && isAdmin()

  useEffect(() => {
    if (!authorized) {
      router.replace("/login")
    }
  }, [authorized, router])

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Checking access...</div>
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm">
          <h1 className="mb-1 text-xl font-bold text-[#0f172a]">Store Admin</h1>
          <p className="mb-4 text-sm text-[#64748b]">Control center</p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#e9f2ff] text-[#0b5ed7]"
                      : "text-[#334155] hover:bg-[#f1f5f9]"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 space-y-2 border-t border-[#e2e8f0] pt-4">
            <Link
              href="/"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-[#334155] hover:bg-[#f1f5f9]"
            >
              Back to Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg bg-[#0f172a] px-3 py-2 text-left text-sm font-medium text-white hover:bg-[#1e293b]"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="rounded-2xl border border-[#dbe5f0] bg-white p-4 shadow-sm sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
