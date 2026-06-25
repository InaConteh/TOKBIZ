import { useEffect, useState } from 'react'
import { Landmark, Plus, Smartphone, CreditCard, Banknote } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const PaymentChannels = () => {
  const [channels, setChannels] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setIsLoading(true)
        const response = await api.getPaymentChannels()
        setChannels(response.data.channels || [])
      } catch (err: any) {
        setError('Unable to load payment channels.')
      } finally {
        setIsLoading(false)
      }
    }
    loadChannels()
  }, [])

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mobile_money': return <Smartphone className="h-5 w-5" />
      case 'bank': return <Landmark className="h-5 w-5" />
      case 'card': return <CreditCard className="h-5 w-5" />
      default: return <Banknote className="h-5 w-5" />
    }
  }

  return (
    <Layout>
      <PageHeader
        title="Payment Channels"
        description="Configure how you receive payments from customers."
        error={error}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Link Channel
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2].map(i => <Card key={i} className="h-48 animate-pulse bg-muted" />)
        ) : channels.length > 0 ? (
          channels.map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  {getIcon(c.type)}
                </div>
                <div>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <CardDescription>{c.provider}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {c.identifier}
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t pt-4 mt-2">
                 <Badge variant={c.active ? 'default' : 'outline'}>
                    {c.active ? 'Active' : 'Disabled'}
                 </Badge>
                 <Button variant="ghost" size="sm">Manage</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <>
            <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/10">
               <Smartphone className="h-10 w-10 text-muted-foreground mb-4 opacity-30" />
               <p className="text-sm font-medium">Link Mobile Money</p>
               <p className="text-xs text-muted-foreground mb-4">Accept Orange or Africell money.</p>
               <Button size="sm" variant="outline">Link Now</Button>
            </Card>
            <Card className="border-dashed flex flex-col items-center justify-center p-8 text-center bg-muted/10">
               <Landmark className="h-10 w-10 text-muted-foreground mb-4 opacity-30" />
               <p className="text-sm font-medium">Link Bank Account</p>
               <p className="text-xs text-muted-foreground mb-4">Direct transfers to local banks.</p>
               <Button size="sm" variant="outline">Link Now</Button>
            </Card>
          </>
        )}
      </div>
    </Layout>
  )
}

export default PaymentChannels
