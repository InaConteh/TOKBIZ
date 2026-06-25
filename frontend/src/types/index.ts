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

export interface Supplier {
  id: number
  business_id: number
  name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  currency: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: number
  business_id: number
  supplier_id?: number
  description: string
  category?: string
  amount: number
  currency: string
  expense_date: string
  paid: boolean
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: number
  business_id: number
  target_type: string
  target_id?: number
  amount: number
  currency: string
  gateway: string
  status: string
  transaction_reference?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  business_id: number
  supplier_id: number
  description: string
  amount: number
  currency: string
  due_date: string
  status: string
  approved: boolean
  paid: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  type: string
  title: string
  message: string
  items?: Array<Record<string, any>>
}

export interface ExchangeRate {
  id: number
  base_currency: string
  target_currency: string
  rate: number
  updated_at: string
}

export interface PaymentChannel {
  id: string
  name: string
  description: string
}

export interface MarketplaceListing {
  id: number
  business_id: number
  title: string
  description: string
  category?: string
  price: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface PartnerService {
  id: string
  name: string
  description: string
  integration_type: string
}

export interface Recommendation {
  title: string
  detail: string
}

export interface TrustScore {
  business_id: number
  business_name: string
  trust_score: number
  invoice_count: number
  note: string
}

export interface DeveloperApiEndpoint {
  path: string
  method: string
  description: string
}

export interface RecurringExpense {
  id: number
  business_id: number
  description: string
  amount: number
  currency: string
  frequency: string
  next_due_date: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
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
