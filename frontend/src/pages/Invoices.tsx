import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Invoice } from '../types'

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await api.getInvoices()
        setInvoices(response.data.invoices)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load invoices.')
      }
    }
    loadInvoices()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Supplier Invoices</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{invoice.description}</h2>
            <p>{invoice.currency} {invoice.amount.toFixed(2)} - {invoice.status}</p>
            <p>Due: {invoice.due_date}</p>
            <p>{invoice.approved ? 'Approved' : 'Pending approval'}</p>
          </div>
        ))}
        {invoices.length === 0 && <p>No invoices found.</p>}
      </div>
    </div>
  )
}

export default Invoices
