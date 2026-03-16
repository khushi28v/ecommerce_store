"use client"

import { useEffect, useState } from "react"
import { fetchProducts, updateProduct, deleteProduct } from "@/lib/admin-api"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>({})

  useEffect(() => {
    void loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      alert("Error loading products")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setEditForm(product)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    try {
      await updateProduct(editingId, editForm)
      await loadProducts()
      setEditingId(null)
    } catch (err) {
      alert("Update failed")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      alert("Delete failed")
    }
  }

  if (loading) return <div className="py-12 text-center">Loading products...</div>

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <button onClick={loadProducts} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product: any) => (
                <tr key={product.id}>
                  <td className="whitespace-nowrap px-4 py-4">{product.name}</td>
                  <td className="whitespace-nowrap px-4 py-4">Rs. {product.price}</td>
                  <td className="whitespace-nowrap px-4 py-4">{product.stock}</td>
                  <td className="whitespace-nowrap px-4 py-4">{product.category_name}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="mt-6 rounded-lg bg-white p-5 shadow sm:p-6">
          <h3 className="mb-4 text-lg font-semibold">Edit Product</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="number"
              placeholder="Price"
              value={editForm.price || ""}
              onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
              className="w-full rounded border p-3"
            />
            <input
              type="number"
              placeholder="Stock"
              value={editForm.stock || ""}
              onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
              className="w-full rounded border p-3"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="submit" className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                Update
              </button>
              <button type="button" onClick={() => setEditingId(null)} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
