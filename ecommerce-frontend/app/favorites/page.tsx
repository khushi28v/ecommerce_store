"use client"

import { useEffect, useState } from "react"
import { useFavorites } from "@/lib/favorites"
import Link from "next/link"

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!favorites || favorites.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        const productPromises = favorites.map((id) =>
          fetch(`http://127.0.0.1:8000/api/products/${id}/`).then((res) => (res.ok ? res.json() : null))
        )

        const productsData = await Promise.all(productPromises)
        setProducts(productsData.filter((p) => p !== null))
      } catch (error) {
        console.error("Failed to fetch favorite products:", error)
      } finally {
        setLoading(false)
      }
    }

    void fetchFavorites()
  }, [favorites])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8F5]">
        <div className="spinner mx-auto animate-spin text-[#647A67]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F8F5] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-[#020402] sm:mb-10 sm:text-4xl">Your Favorites</h1>

        {products.length === 0 ? (
          <div className="py-16 text-center sm:py-20">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-700">No Favorites Yet</h2>
            <p className="mb-6 text-gray-500">Start adding products to your favorites list.</p>
            <Link href="/">
              <button className="rounded-lg bg-[#647A67] px-6 py-3 text-white transition hover:bg-[#3C433B]">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border border-[#E8F0E8] bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image?.startsWith("http") ? product.image : `http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                </Link>
                <div className="p-5">
                  <Link href={`/product/${product.id}`}>
                    <h2 className="mb-2 line-clamp-1 text-lg font-semibold text-[#020402]">{product.name}</h2>
                  </Link>
                  <p className="mb-4 font-bold text-[#647A67]">Rs. {product.price}</p>

                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="w-full rounded border border-red-500 py-2 text-red-500 transition hover:bg-red-50"
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
