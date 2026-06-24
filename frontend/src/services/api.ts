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
