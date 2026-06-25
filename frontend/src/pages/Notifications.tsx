import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Notification } from '../types'

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await api.getNotifications()
        setNotifications(response.data.notifications)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load notifications.')
      }
    }
    loadNotifications()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {notifications.map((note) => (
          <div key={note.type} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="mb-3">{note.message}</p>
            {note.items && note.items.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {note.items.slice(0, 5).map((item, index) => (
                  <li key={index}>{item.description || item.name || item.customer_name || item.title || 'Item'}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {notifications.length === 0 && <p>No notifications at this time.</p>}
      </div>
    </div>
  )
}

export default Notifications
