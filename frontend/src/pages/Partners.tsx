import { useEffect, useState } from 'react'
import { Handshake, Building2, Phone, Mail } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const Partners = () => {
  const [partners, setPartners] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPartners = async () => {
      try {
        setIsLoading(true)
        const response = await api.getPartnerServices()
        setPartners(response.data.partners || [])
      } catch (err: any) {
        setError('Unable to load partners.')
      } finally {
        setIsLoading(false)
      }
    }
    loadPartners()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Partners"
        description="Collaborate with other businesses and organizations."
        error={error}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-muted" />)
        ) : partners.length > 0 ? (
          partners.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{p.type}</Badge>
                </div>
                <CardTitle className="mt-4">{p.name}</CardTitle>
                <CardDescription>{p.industry}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" /> {p.phone || 'N/A'}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" /> {p.email || 'N/A'}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                 <Button variant="ghost" className="w-full gap-2">
                    <Handshake className="h-4 w-4" /> Partner Up
                 </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
             <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
             <p className="text-muted-foreground">Looking for strategic partners? Start networking today.</p>
             <Button className="mt-4">Find Partners</Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Partners
