import { useEffect, useState } from 'react'
import api from '../services/api'
import type { TrustScore } from '../types'

const TrustScores = () => {
  const [scores, setScores] = useState<TrustScore[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadScores = async () => {
      try {
        const response = await api.getTrustScores()
        setScores(response.data.trust_scores)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load trust scores.')
      }
    }
    loadScores()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Trust Scores</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {scores.length === 0 ? (
        <p>No trust score data available yet.</p>
      ) : (
        <div className="space-y-4">
          {scores.map((score) => (
            <div key={score.business_id} className="rounded border p-4">
              <h2 className="text-xl font-semibold">{score.business_name}</h2>
              <p>Trust Score: {score.trust_score}%</p>
              <p>Invoice Count: {score.invoice_count}</p>
              <p className="mt-2 text-slate-700">{score.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TrustScores
