import { useEffect, useState } from 'react'
import api from '../services/api'
import type { ExchangeRate } from '../types'

const ExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRates = async () => {
      try {
        const response = await api.getExchangeRates()
        setRates(response.data.exchange_rates)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load exchange rates.')
      }
    }
    loadRates()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Exchange Rates</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {rates.map((rate) => (
          <div key={`${rate.base_currency}-${rate.target_currency}`} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{rate.base_currency} → {rate.target_currency}</h2>
            <p className="mt-2">Rate: {rate.rate}</p>
            <p>Updated: {rate.updated_at}</p>
          </div>
        ))}
        {rates.length === 0 && <p>No exchange rates available yet.</p>}
      </div>
    </div>
  )
}

export default ExchangeRates
