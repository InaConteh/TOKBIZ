import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Supplier } from '../types'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const response = await api.getSuppliers()
        setSuppliers(response.data.suppliers)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load suppliers.')
      }
    }
    loadSuppliers()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Suppliers</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{supplier.name}</h2>
            <p>{supplier.contact_name || 'No contact name'}</p>
            <p>{supplier.email || supplier.phone || 'No contact info'}</p>
          </div>
        ))}
        {suppliers.length === 0 && <p>No suppliers yet.</p>}
      </div>
    </div>
  )
}

export default Suppliers
