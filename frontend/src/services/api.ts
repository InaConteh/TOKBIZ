import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  register(email: string, password: string, name: string) {
    return this.client.post('/auth/register', { email, password, name })
  }

  login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password })
  }

  refresh() {
    return this.client.post('/auth/refresh')
  }

  // Business endpoints
  getBusinesses() {
    return this.client.get('/businesses')
  }

  createBusiness(data: any) {
    return this.client.post('/businesses', data)
  }

  getBusiness(id: number) {
    return this.client.get(`/businesses/${id}`)
  }

  updateBusiness(id: number, data: any) {
    return this.client.put(`/businesses/${id}`, data)
  }

  // Products endpoints
  getProducts() {
    return this.client.get('/products')
  }

  createProduct(data: any) {
    return this.client.post('/products', data)
  }

  getProduct(id: number) {
    return this.client.get(`/products/${id}`)
  }

  updateProduct(id: number, data: any) {
    return this.client.put(`/products/${id}`, data)
  }

  deleteProduct(id: number) {
    return this.client.delete(`/products/${id}`)
  }

  // Sales endpoints
  getSales() {
    return this.client.get('/sales')
  }

  createSale(data: any) {
    return this.client.post('/sales', data)
  }

  getSale(id: number) {
    return this.client.get(`/sales/${id}`)
  }

  // Debtors endpoints
  getDebtors() {
    return this.client.get('/debtors')
  }

  createDebtor(data: any) {
    return this.client.post('/debtors', data)
  }

  getDebtor(id: number) {
    return this.client.get(`/debtors/${id}`)
  }

  updateDebtor(id: number, data: any) {
    return this.client.put(`/debtors/${id}`, data)
  }

  recordPayment(debtorId: number, data: any) {
    return this.client.post(`/debtors/${debtorId}/payments`, data)
  }

  // Analytics endpoints
  getAnalyticsSummary() {
    return this.client.get('/analytics/summary')
  }

  getSalesTrends() {
    return this.client.get('/analytics/sales-trends')
  }

  getTopProducts() {
    return this.client.get('/analytics/top-products')
  }

  getDebtSummary() {
    return this.client.get('/analytics/debt-summary')
  }

  getInventoryStatus() {
    return this.client.get('/analytics/inventory-status')
  }

  // Supplier endpoints
  getSuppliers() {
    return this.client.get('/suppliers')
  }

  createSupplier(data: any) {
    return this.client.post('/suppliers', data)
  }

  getSupplier(id: number) {
    return this.client.get(`/suppliers/${id}`)
  }

  updateSupplier(id: number, data: any) {
    return this.client.put(`/suppliers/${id}`, data)
  }

  deleteSupplier(id: number) {
    return this.client.delete(`/suppliers/${id}`)
  }

  // Expense endpoints
  getExpenses() {
    return this.client.get('/expenses')
  }

  createExpense(data: any) {
    return this.client.post('/expenses', data)
  }

  getExpense(id: number) {
    return this.client.get(`/expenses/${id}`)
  }

  updateExpense(id: number, data: any) {
    return this.client.put(`/expenses/${id}`, data)
  }

  deleteExpense(id: number) {
    return this.client.delete(`/expenses/${id}`)
  }

  // Payment transaction endpoints
  getPaymentTransactions() {
    return this.client.get('/payments')
  }

  createPaymentTransaction(data: any) {
    return this.client.post('/payments', data)
  }

  getPaymentTransaction(id: number) {
    return this.client.get(`/payments/${id}`)
  }

  // Invoice endpoints
  getInvoices() {
    return this.client.get('/invoices')
  }

  createInvoice(data: any) {
    return this.client.post('/invoices', data)
  }

  getInvoice(id: number) {
    return this.client.get(`/invoices/${id}`)
  }

  updateInvoice(id: number, data: any) {
    return this.client.put(`/invoices/${id}`, data)
  }

  deleteInvoice(id: number) {
    return this.client.delete(`/invoices/${id}`)
  }

  // Notification endpoints
  getNotifications() {
    return this.client.get('/notifications')
  }

  // Exchange rate endpoints
  getExchangeRates() {
    return this.client.get('/exchange-rates')
  }

  createExchangeRate(data: any) {
    return this.client.post('/exchange-rates', data)
  }

  // Payment channel endpoints
  getPaymentChannels() {
    return this.client.get('/payment-channels')
  }

  getMarketplaceListings() {
    return this.client.get('/marketplace')
  }

  createMarketplaceListing(data: any) {
    return this.client.post('/marketplace', data)
  }

  getPartnerServices() {
    return this.client.get('/partners')
  }

  getRecommendations() {
    return this.client.get('/recommendations')
  }

  getTrustScores() {
    return this.client.get('/trust')
  }

  getDeveloperApi() {
    return this.client.get('/developer-api')
  }

  // Recurring expense endpoints
  getRecurringExpenses() {
    return this.client.get('/recurring-expenses')
  }

  createRecurringExpense(data: any) {
    return this.client.post('/recurring-expenses', data)
  }

  // Role and permission endpoints
  getRoles() {
    return this.client.get('/roles')
  }

  getPermissions() {
    return this.client.get('/roles/permissions')
  }

  // AI endpoints
  getSalesInsights(data: any) {
    return this.client.post('/ai/sales-insights', data)
  }

  getDebtRisks(data: any) {
    return this.client.post('/ai/debt-risks', data)
  }

  getInventoryForecast(data: any) {
    return this.client.post('/ai/inventory-forecast', data)
  }

  getHealthScore(data: any) {
    return this.client.post('/ai/health-score', data)
  }
}

export default new ApiClient()
