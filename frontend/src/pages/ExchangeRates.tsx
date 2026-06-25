import { useEffect, useState } from 'react'
import { RefreshCcw, DollarSign, ArrowLeftRight } from 'lucide-react'
import api from '../services/api'
import type { ExchangeRate } from '../types'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const ExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRates = async () => {
      try {
        setIsLoading(true)
        const response = await api.getExchangeRates()
        setRates(response.data.exchange_rates || [])
      } catch (err: any) {
        setError('Unable to load exchange rates.')
      } finally {
        setIsLoading(false)
      }
    }
    loadRates()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Exchange Rates"
        description="Monitor currency fluctuations in Sierra Leone."
        error={error}
      >
        <Button variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" /> Refresh Rates
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              USD to SLE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">22.50</div>
            <p className="text-sm text-muted-foreground mt-1">Sierra Leonean Leone (SLE) per 1 USD</p>
            <div className="mt-4">
               <Badge className="bg-green-500/10 text-green-500 border-none">+0.5% today</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Quick Converter
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
             <div className="flex gap-2 items-center">
                <div className="flex-1 p-2 border rounded-md text-sm">100 USD</div>
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 p-2 border rounded-md text-sm bg-muted">2,250 SLE</div>
             </div>
             <Button variant="outline" size="sm" className="w-fit">View Trends</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rates</CardTitle>
          <CardDescription>Market rates for major currencies against SLE.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center animate-pulse text-muted-foreground">Loading rates...</div>
          ) : rates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Base</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.base_currency}</TableCell>
                    <TableCell>{r.target_currency}</TableCell>
                    <TableCell>{r.rate.toFixed(4)}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.updated_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="py-10 text-center text-muted-foreground italic">
                Local rates data currently unavailable.
             </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default ExchangeRates
