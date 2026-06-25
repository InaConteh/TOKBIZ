import { useEffect, useState } from 'react'
import api from '../services/api'
import type { PaymentTransaction } from '../types'

const Payments = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const response = await api.getPaymentTransactions()
        setPayments(response.data.payments)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load payments.')
      }
    }
    loadPayments()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{payment.description || payment.gateway}</h2>
            <p>{payment.currency} {payment.amount.toFixed(2)}</p>
            <p>Status: {payment.status}</p>
          </div>
        ))}
        {payments.length === 0 && <p>No payment transactions available yet.</p>}
      </div>
    </div>
  )
}

export default Payments
