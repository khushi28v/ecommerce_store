"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function SearchPage() {
  const params = useSearchParams()
  const query = params.get("q")

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) {
      setProducts([])
      setLoading(false)
      return
    }

    setLoading(true)

    fetch(`http://127.0.0.1:8000/api/products/?search=${query}`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-8 text-xl font-bold sm:text-2xl">
        Search results for: <span className="text-[#647A67]">{query || ""}</span>
      </h1>

      {loading && <p className="text-sm text-gray-500">Loading products...</p>}
      {!loading && products.length === 0 && <p className="text-sm text-gray-500">No products found.</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.map((p: any) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div className="cursor-pointer rounded-lg border bg-white p-4 transition hover:shadow-md">
              <img src={p.image} alt={p.name} className="mb-3 h-40 w-full object-contain" />
              <h3 className="line-clamp-2 text-sm font-medium">{p.name}</h3>
              <p className="mt-2 font-semibold text-[#647A67]">Rs. {p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
