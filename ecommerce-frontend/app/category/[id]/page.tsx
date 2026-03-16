"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function CategoryPage() {
  const { id } = useParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/products/?category=${id}`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-6 text-2xl font-bold">Category Products</h1>

      {loading && <p className="text-sm text-gray-500">Loading products...</p>}
      {!loading && products.length === 0 && <p className="text-sm text-gray-500">No products in this category.</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.map((p: any) => (
          <Link key={p.id} href={`/product/${p.id}`}>
            <div className="rounded-lg border bg-white p-4 transition hover:shadow-md">
              <img src={p.image} alt={p.name} className="mb-3 h-40 w-full object-contain" />
              <h3 className="line-clamp-2 text-sm font-medium">{p.name}</h3>
              <p className="font-semibold text-green-600">Rs. {p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
