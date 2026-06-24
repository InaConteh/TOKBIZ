// User types
export interface User {
  id: number
  name: string
  email: string
  role: 'Owner' | 'Staff'
  created_at: string
}

// Business types
export interface Business {
  id: number
  owner_id: number
  name: string
  category: string
  location: string
  created_at: string
}

// Product types
export interface Product {
  id: number
  business_id: number
  name: string
  price: number
  quantity: number
  created_at: string
}

// Sales types
export interface Sale {
  id: number
  business_id: number
  total_amount: number
  date: string
}

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  quantity: number
  price: number
}

// Debtor types
export interface Debtor {
  id: number
  business_id: number
  customer_name: string
  amount_owed: number
  due_date: string
  status: 'Outstanding' | 'Paid' | 'Overdue'
  created_at: string
}

export interface Payment {
  id: number
  debtor_id: number
  amount_paid: number
  date: string
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// Analytics types
export interface AnalyticsSummary {
  total_sales: number
  total_revenue: number
  total_debt: number
  inventory_value: number
}

export interface SalesTrend {
  date: string
  amount: number
  count: number
}

export interface TopProduct {
  name: string
  quantity_sold: number
  revenue: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  status: 'success' | 'error'
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
