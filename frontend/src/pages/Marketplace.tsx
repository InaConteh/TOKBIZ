import { useEffect, useState } from 'react'
import api from '../services/api'
import type { MarketplaceListing } from '../types'

const Marketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await api.getMarketplaceListings()
        setListings(response.data.marketplace_listings)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load marketplace listings.')
      }
    }
    loadListings()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {listings.length === 0 ? (
        <p>No marketplace listings available yet.</p>
      ) : (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="rounded border p-4">
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-sm text-slate-600">{listing.category || 'General'}</p>
              <p className="mt-2">{listing.description}</p>
              <p className="mt-2 font-semibold">Price: {listing.price.toFixed(2)}</p>
              <p>Status: {listing.active ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Marketplace
