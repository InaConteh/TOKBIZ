import { useEffect, useState } from 'react'
import api from '../services/api'
import type { PaymentChannel } from '../types'

const PaymentChannels = () => {
  const [channels, setChannels] = useState<PaymentChannel[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const response = await api.getPaymentChannels()
        setChannels(response.data.payment_channels)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load payment channels.')
      }
    }
    loadChannels()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Payment Channels</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {channels.map((channel) => (
          <div key={channel.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p className="mt-2">{channel.description}</p>
          </div>
        ))}
        {channels.length === 0 && <p>No payment channels available yet.</p>}
      </div>
    </div>
  )
}

export default PaymentChannels
