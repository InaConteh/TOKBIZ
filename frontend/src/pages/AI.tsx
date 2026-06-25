import { useState } from 'react'
import api from '../services/api'

const AI = () => {
  const [insight, setInsight] = useState('')
  const [type, setType] = useState<'sales' | 'debt' | 'inventory' | 'health'>('sales')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRun = async () => {
    setError('')
    setLoading(true)
    setInsight('')

    try {
      const response = await api[
        type === 'sales'
          ? 'getSalesInsights'
          : type === 'debt'
          ? 'getDebtRisks'
          : type === 'inventory'
          ? 'getInventoryForecast'
          : 'getHealthScore'
      ]({})
      setInsight(response.data.insights || response.data.risks || response.data.forecast || response.data.health_score)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to retrieve AI insights.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">AI Business Assistant</h1>
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <button
          type="button"
          className={`rounded px-4 py-2 ${type === 'sales' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-800'}`}
          onClick={() => setType('sales')}
        >
          Sales Insights
        </button>
        <button
          type="button"
          className={`rounded px-4 py-2 ${type === 'debt' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-800'}`}
          onClick={() => setType('debt')}
        >
          Debt Risk
        </button>
        <button
          type="button"
          className={`rounded px-4 py-2 ${type === 'inventory' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-800'}`}
          onClick={() => setType('inventory')}
        >
          Inventory Forecast
        </button>
        <button
          type="button"
          className={`rounded px-4 py-2 ${type === 'health' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-800'}`}
          onClick={() => setType('health')}
        >
          Health Score
        </button>
      </div>
      <button
        type="button"
        onClick={handleRun}
        disabled={loading}
        className="rounded bg-slate-900 px-4 py-2 text-white"
      >
        {loading ? 'Running AI...' : 'Run AI Analysis'}
      </button>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {insight && (
        <div className="mt-6 rounded border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">AI Output</h2>
          <p className="whitespace-pre-line text-slate-800">{insight}</p>
        </div>
      )}
    </div>
  )
}

export default AI
