import { getToken } from './auth';

const API_BASE = 'http://127.0.0.1:8000/api/auth';

export interface DashboardTopProduct {
  product__name: string;
  total_sales: number;
  order_count: number;
}

export interface DashboardData {
  total_sales: number;
  total_orders: number;
  top_products: DashboardTopProduct[];
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  category: number;
  category_name?: string;
  created_at?: string;
}

export interface AdminOrder {
  id: number;
  user: number;
  total_price: number;
  status: string;
  created_at: string;
}

type AdminOrderUpdate = {
  status: string;
};

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}

export async function fetchDashboardData() {
  return adminRequest<DashboardData>('/admin/dashboard/');
}

export async function fetchProducts() {
  return adminRequest<AdminProduct[]>('/admin/products/', {
    headers: { 'Content-Type': 'text/plain' },
  });
}

export async function updateProduct(id: number, data: Partial<AdminProduct>) {
  return adminRequest<AdminProduct>(`/admin/products/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number) {
  await adminRequest<null>(`/admin/products/${id}/`, {
    method: 'DELETE',
  });
}

export async function fetchOrders() {
  return adminRequest<AdminOrder[]>('/admin/orders/', {
    headers: { 'Content-Type': 'text/plain' },
  });
}

export async function updateOrder(id: number, data: AdminOrderUpdate) {
  return adminRequest<AdminOrder>(`/admin/orders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
