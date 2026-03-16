"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { parseJwt } from "@/lib/auth"

export default function Navbar() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [authState, setAuthState] = useState({ loggedIn: false, isAdminUser: false })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const payload = parseJwt(token)
    setAuthState({
      loggedIn: Boolean(token),
      isAdminUser: Boolean(payload?.is_staff),
    })
    setMounted(true)
  }, [])

  const handleSearch = () => {
    if (!search.trim()) return
    router.push(`/search?q=${encodeURIComponent(search.trim())}`)
    setMobileOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setAuthState({ loggedIn: false, isAdminUser: false })
    router.push("/")
  }

  return (
    <nav className="bg-[#1F241F] text-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-xl font-bold text-[#C5EFCB]">
            Seatera
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <div className="flex w-full max-w-xl items-center overflow-hidden rounded-lg bg-white">
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                className="w-full px-4 py-2 text-black outline-none"
              />
              <button onClick={handleSearch} className="bg-[#647A67] px-4 py-2 text-white">
                Search
              </button>
            </div>
          </div>

          <button
            type="button"
            className="rounded-md border border-[#3C433B] px-3 py-2 text-sm md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            Menu
          </button>

          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/">Home</Link>
            <Link href="/#products">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/favorites">Favorites</Link>
            {mounted && authState.loggedIn && <Link href="/orders">Orders</Link>}
            {mounted && authState.loggedIn && authState.isAdminUser && (
              <Link href="/admin" className="rounded bg-blue-600 px-3 py-1 hover:bg-blue-700">
                Admin
              </Link>
            )}
            {!mounted ? null : !authState.loggedIn ? (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="text-red-300">
                Logout
              </button>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-3 space-y-3 md:hidden">
            <div className="flex items-center overflow-hidden rounded-lg bg-white">
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch()
                }}
                className="w-full px-4 py-2 text-black outline-none"
              />
              <button onClick={handleSearch} className="bg-[#647A67] px-4 py-2 text-white">
                Go
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                Home
              </Link>
              <Link href="/#products" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                Products
              </Link>
              <Link href="/cart" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                Cart
              </Link>
              <Link href="/favorites" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                Favorites
              </Link>
              {mounted && authState.loggedIn && (
                <Link href="/orders" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                  Orders
                </Link>
              )}
              {mounted && authState.loggedIn && authState.isAdminUser && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded bg-blue-600 px-3 py-2">
                  Admin
                </Link>
              )}
              {!mounted ? null : !authState.loggedIn ? (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded bg-[#2a312a] px-3 py-2">
                    Register
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="col-span-2 rounded bg-red-700 px-3 py-2 text-left">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#3C433B]">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-2 text-sm sm:px-6">
          <Link href="/category/1" className="rounded bg-[#4a5349] px-3 py-1">Phones</Link>
          <Link href="/category/2" className="rounded bg-[#4a5349] px-3 py-1">Mouse</Link>
          <Link href="/category/3" className="rounded bg-[#4a5349] px-3 py-1">Keyboard</Link>
          <Link href="/category/4" className="rounded bg-[#4a5349] px-3 py-1">Accessories</Link>
        </div>
      </div>
    </nav>
  )
}
