import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { AnalyticsSummary } from '../types'

const Dashboard = () => {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.getAnalyticsSummary()
        setSummary(response.data.summary)
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token')
          navigate('/login')
          return
        }
        setError(err.response?.data?.message || 'Unable to load dashboard.')
      }
    }
    loadSummary()
  }, [navigate])

  const handleSignOut = () => {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-600">Quick business health overview</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Sign Out
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {summary ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="rounded border p-4">
              <h2 className="text-lg font-semibold mb-2">Sales</h2>
              <p>Total Sales: {summary.total_sales.toFixed(2)}</p>
              <p>Total Revenue: {summary.total_revenue.toFixed(2)}</p>
            </div>
            <div className="rounded border p-4">
              <h2 className="text-lg font-semibold mb-2">Debt</h2>
              <p>Total Debt: {summary.total_debt.toFixed(2)}</p>
            </div>
            <div className="rounded border p-4 md:col-span-2">
              <h2 className="text-lg font-semibold mb-2">Inventory</h2>
              <p>Inventory Value: {summary.inventory_value.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <a
              href="/ai"
              className="rounded bg-indigo-600 px-4 py-2 text-white"
            >
              Open AI Insights
            </a>
          </div>
        </>
      ) : (
        <p>Loading dashboard...</p>
      )}
    </div>
  )
}

export default Dashboard
