"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useFavorites } from "@/lib/favorites"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { isFavorite, toggleFavorite } = useFavorites()

  const productId = Number(id)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setSelectedImage(data.image)
      })

    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p: any) => p.id != id)
        setRelatedProducts(filtered.slice(0, 4))
      })
  }, [id])

  const addToCart = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login to add to cart")
      return
    }

    try {
      await fetch("http://127.0.0.1:8000/api/orders/cart-items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product: product.id, quantity }),
      })
      alert("Added to cart")
    } catch (err) {
      alert("Failed to add to cart. Please login again.")
    }
  }

  if (!product) return <p className="p-6">Loading...</p>

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex gap-2 sm:flex-col">
            <img
              src={product.image}
              alt={product.name}
              onClick={() => setSelectedImage(product.image)}
              className="h-16 w-16 cursor-pointer rounded border object-cover"
            />
          </div>

          <div className="flex w-full items-center justify-center rounded-lg border bg-white p-4">
            <img src={selectedImage} alt={product.name} className="max-h-[350px] object-contain" />
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-xl font-semibold sm:text-2xl">{product.name}</h1>

          <div className="mb-3 flex items-center gap-2">
            <span className="text-yellow-500">4.0 rating</span>
            <span className="text-sm text-gray-500">(1,247 ratings)</span>
          </div>

          <p className="text-2xl font-bold text-red-600 sm:text-3xl">Rs. {product.price}</p>
          <p className="mb-4 text-sm text-gray-500">Inclusive of all taxes</p>

          <p className="mb-5 text-gray-700">{product.description}</p>

          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="rounded border px-3 py-2 hover:bg-gray-100"
            >
              -
            </button>

            <span className="text-lg">{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)} className="rounded border px-3 py-2 hover:bg-gray-100">
              +
            </button>
          </div>

          <ul className="ml-5 list-disc space-y-1 text-sm text-gray-700">
            <li>High quality product</li>
            <li>Durable build</li>
            <li>1 year manufacturer warranty</li>
            <li>Fast delivery available</li>
          </ul>
        </div>

        <div className="h-fit rounded-lg border bg-white p-5 shadow-sm">
          <p className="mb-3 text-2xl font-semibold">Rs. {product.price}</p>
          <p className="mb-4 text-green-600">In Stock ({product.stock})</p>

          <button onClick={addToCart} className="mb-3 w-full rounded bg-yellow-400 py-2 hover:bg-yellow-500">
            Add to Cart
          </button>

          <button
            onClick={() => toggleFavorite(productId)}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded bg-gray-200 py-2 text-gray-700 hover:bg-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill={isFavorite(productId) ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 21s-6.716-4.63-9.243-8.017A5.74 5.74 0 0 1 2 9.586C2 6.502 4.463 4 7.5 4c1.795 0 3.39.88 4.5 2.23C13.11 4.88 14.705 4 16.5 4 19.537 4 22 6.502 22 9.586a5.74 5.74 0 0 1-.757 3.397C18.716 16.37 12 21 12 21z" />
            </svg>
            {isFavorite(productId) ? "Remove Favorite" : "Save Favorite"}
          </button>

          <button
            onClick={() => router.push(`/checkout?buyNow=${product.id}&qty=${quantity}`)}
            className="w-full rounded bg-orange-500 py-2 text-white hover:bg-orange-600"
          >
            Buy Now
          </button>

          <p className="mt-3 text-xs text-gray-500">Secure transaction</p>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <h2 className="mb-6 text-xl font-semibold">Related Products</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6">
          {relatedProducts.map((item: any) => (
            <Link href={`/product/${item.id}`} key={item.id}>
              <div className="cursor-pointer rounded-lg border bg-white p-4 transition hover:shadow-md">
                <img src={item.image} alt={item.name} className="mb-3 h-40 w-full object-contain" />
                <h3 className="line-clamp-2 text-sm font-medium">{item.name}</h3>
                <p className="mt-2 font-semibold text-red-600">Rs. {item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
