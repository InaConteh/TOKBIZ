import { useEffect, useState } from 'react'
import api from '../services/api'
import type { PartnerService } from '../types'

const Partners = () => {
  const [partners, setPartners] = useState<PartnerService[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await api.getPartnerServices()
        setPartners(response.data.partners)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load partner services.')
      }
    }
    loadPartners()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Partner Services</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {partners.length === 0 ? (
        <p>No partner services available yet.</p>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="rounded border p-4">
              <h2 className="text-xl font-semibold">{partner.name}</h2>
              <p className="text-sm text-slate-600">{partner.integration_type}</p>
              <p className="mt-2">{partner.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Partners
