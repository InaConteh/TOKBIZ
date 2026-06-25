import { useEffect, useState } from 'react'
import api from '../services/api'
import type { DeveloperApiEndpoint } from '../types'

const DeveloperAPI = () => {
  const [endpoints, setEndpoints] = useState<DeveloperApiEndpoint[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        const response = await api.getDeveloperApi()
        setEndpoints(response.data.developer_api)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load developer API documentation.')
      }
    }
    loadEndpoints()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Developer API</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {endpoints.length === 0 ? (
        <p>No third-party API metadata available yet.</p>
      ) : (
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <div key={`${endpoint.method}-${endpoint.path}`} className="rounded border p-4">
              <p className="font-semibold">{endpoint.method} {endpoint.path}</p>
              <p className="mt-2 text-slate-700">{endpoint.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DeveloperAPI
