"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useFavorites } from "@/lib/favorites"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const { isFavorite, toggleFavorite } = useFavorites()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const heroProduct = products[0]

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("http://127.0.0.1:8000/api/products/")
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load products. Ensure Django backend is running on http://127.0.0.1:8000")
      } finally {
        setLoading(false)
      }
    }

    void loadProducts()
  }, [])

  return (
    <div className="bg-[#f5f8f5]">
      <section className="relative overflow-hidden border-b border-[#e5ede4] bg-gradient-to-br from-[#eef5ed] via-[#f5f8f5] to-[#fdf7ed]">
        <div className="pointer-events-none absolute -left-14 top-8 h-40 w-40 rounded-full bg-[#d6ead8] blur-2xl animate-glow"></div>
        <div className="pointer-events-none absolute -right-10 bottom-6 h-44 w-44 rounded-full bg-[#f4e4c8] blur-2xl animate-glow" style={{ animationDelay: "1.2s" }}></div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <p className="mb-3 inline-block rounded-full bg-[#dcecdc] px-3 py-1 text-xs font-semibold tracking-wide text-[#335438] animate-reveal">
              SEATERA ESSENTIALS
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#122014] sm:text-5xl animate-reveal" style={{ animationDelay: "0.1s" }}>
              Everyday Products,
              <span className="block text-[#5f755f]">Better Design.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base animate-reveal" style={{ animationDelay: "0.2s" }}>
              Discover modern picks for your desk, room, and routine. Clean design, fair price, quick delivery.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row animate-reveal" style={{ animationDelay: "0.3s" }}>
              <a href="#products" className="inline-flex items-center justify-center rounded-lg bg-[#1f241f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#323b31]">
                Shop Featured
              </a>
              <Link href="/favorites" className="inline-flex items-center justify-center rounded-lg border border-[#cfdccf] bg-white px-6 py-3 text-sm font-semibold text-[#2f4232] hover:bg-[#f1f6f1]">
                View Favorites
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-[#dfe8de] bg-white p-4 shadow-sm sm:p-6 animate-float">
              <div className="rounded-xl bg-[#f7faf7] p-4">
                {heroProduct?.image ? (
                  <img
                    src={heroProduct.image}
                    alt={heroProduct.name || "Featured Product"}
                    className="h-56 w-full object-contain sm:h-72"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-[#cfdccf] text-sm text-[#647A67] sm:h-72">
                    Featured product image
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-[#647A67]">Featured Pick</p>
                <p className="mt-1 line-clamp-1 text-lg font-semibold text-[#132015]">
                  {heroProduct?.name || "Premium Essentials"}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {heroProduct ? `Now at Rs. ${heroProduct.price}` : "Fresh arrivals updated daily"}
                </p>
              </div>
            </div>

            <div className="absolute -bottom-3 -left-3 rounded-lg border border-[#dbe5f6] bg-[#f4f8ff] px-3 py-2 text-xs font-semibold text-[#2754a6] shadow-sm animate-float" style={{ animationDelay: "0.4s" }}>
              Curated Picks
            </div>
            <div className="absolute -right-3 -top-3 rounded-lg border border-[#f0e3cc] bg-[#fffaf1] px-3 py-2 text-xs font-semibold text-[#9b6405] shadow-sm animate-float" style={{ animationDelay: "0.9s" }}>
              Fast Dispatch
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#132015] sm:text-3xl">Featured Products</h2>
            <p className="mt-1 text-sm text-gray-600">Handpicked from our latest collection</p>
          </div>
          <Link href="/search?q=" className="text-sm font-semibold text-[#647A67] hover:underline">
            Browse all products
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && !error && <p className="py-8 text-center text-sm text-gray-500">Loading products...</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {products.map((product: any) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <article className="group relative rounded-xl border border-[#e3ece2] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <button
                  className="absolute right-3 top-3 rounded-full border border-[#edf2ed] bg-white p-1.5 text-gray-400 shadow-sm transition hover:text-red-500"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(product.id)
                  }}
                  aria-label="Toggle favorite"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill={isFavorite(product.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6.716-4.63-9.243-8.017A5.74 5.74 0 0 1 2 9.586C2 6.502 4.463 4 7.5 4c1.795 0 3.39.88 4.5 2.23C13.11 4.88 14.705 4 16.5 4 19.537 4 22 6.502 22 9.586a5.74 5.74 0 0 1-.757 3.397C18.716 16.37 12 21 12 21z" />
                  </svg>
                </button>

                <div className="rounded-lg bg-[#f7faf7] p-3">
                  <img src={product.image} alt={product.name} className="h-44 w-full object-contain" />
                </div>

                <h3 className="mt-4 line-clamp-2 text-sm font-semibold text-[#172517]">{product.name}</h3>
                <p className="mt-2 text-lg font-bold text-[#d14f17]">Rs. {product.price}</p>

                <div className="mt-3 text-xs text-[#607460]">Tap to view details</div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
