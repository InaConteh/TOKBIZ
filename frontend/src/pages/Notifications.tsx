import { useEffect, useState } from 'react'
import { Bell, Info, CheckCircle2, AlertTriangle, Clock, Trash2 } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true)
        const response = await api.getNotifications()
        setNotifications(response.data.notifications || [])
      } catch (err: any) {
        setError('Unable to load notifications.')
      } finally {
        setIsLoading(false)
      }
    }
    loadNotifications()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Layout>
      <PageHeader
        title="Notifications"
        description="Stay updated with your business activities and alerts."
        error={error}
      >
        <Button variant="outline" size="sm">Mark all as read</Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Card key={i} className="h-24 animate-pulse bg-muted" />)}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <Card key={n.id} className={n.read ? 'opacity-70' : 'border-l-4 border-l-primary'}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className={`font-semibold ${n.read ? '' : 'text-primary'}`}>{n.title}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {n.time || 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-20 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default Notifications
