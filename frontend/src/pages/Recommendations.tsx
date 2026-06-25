import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Recommendation } from '../types'

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const response = await api.getRecommendations()
        setRecommendations(response.data.recommendations)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load recommendations.')
      }
    }
    loadRecommendations()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Recommendations</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {recommendations.length === 0 ? (
        <p>No recommendations available yet.</p>
      ) : (
        <div className="space-y-4">
          {recommendations.map((item, index) => (
            <div key={index} className="rounded border p-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-slate-700">{item.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Recommendations
