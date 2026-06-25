import { useEffect, useState } from 'react'
import { Sparkles, Lightbulb } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const Recommendations = () => {
  const [recs, setRecs] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRecs = async () => {
      try {
        setIsLoading(true)
        const response = await api.getRecommendations()
        setRecs(response.data.recommendations || [])
      } catch (err: any) {
        setError('Unable to load recommendations.')
      } finally {
        setIsLoading(false)
      }
    }
    loadRecs()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Recommendations"
        description="Personalized AI suggestions to grow your business."
        error={error}
      />

      <div className="grid gap-6">
        {isLoading ? (
          [1, 2].map(i => <Card key={i} className="h-32 animate-pulse bg-muted" />)
        ) : recs.length > 0 ? (
          recs.map((r, i) => (
            <Card key={i} className="overflow-hidden">
               <div className="flex flex-col md:flex-row">
                  <div className={`w-2 md:w-16 flex items-center justify-center bg-primary/10 text-primary`}>
                     <Lightbulb className="h-6 w-6 hidden md:block" />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{r.title}</CardTitle>
                        <Badge variant="secondary" className="capitalize">{r.priority} Priority</Badge>
                      </div>
                      <CardDescription>{r.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{r.description}</p>
                    </CardContent>
                    <CardFooter className="gap-2">
                       <Button size="sm">Implement Now</Button>
                       <Button size="sm" variant="ghost">Save for Later</Button>
                    </CardFooter>
                  </div>
               </div>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center border rounded-xl bg-muted/20">
             <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 opacity-40" />
             <p className="text-muted-foreground max-w-sm mx-auto">
                No active recommendations. Check back after you've recorded more business activity.
             </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Recommendations
