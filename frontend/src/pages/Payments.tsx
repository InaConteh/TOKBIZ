import { useEffect, useState } from 'react'
import { Plus, ArrowUpRight, CreditCard } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const Payments = () => {
  const [payments, setPayments] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setIsLoading(true)
        const response = await api.getPaymentTransactions()
        setPayments(response.data.payments || [])
      } catch (err: any) {
        setError('Unable to load payments.')
      } finally {
        setIsLoading(false)
      }
    }
    loadPayments()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Payments"
        description="Monitor and process business transactions."
        error={error}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Payment
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Inflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Le 45,200,000</div>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Le 12,850,000</div>
            <p className="text-xs text-red-500 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Le 32,350,000</div>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +20% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent payments and transfers.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center animate-pulse text-muted-foreground">Loading payments...</div>
          ) : payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Recipient/Source</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{p.source || 'General Transaction'}</TableCell>
                    <TableCell>{p.category || 'Other'}</TableCell>
                    <TableCell className={p.type === 'inflow' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {p.type === 'inflow' ? '+' : '-'} {p.currency} {p.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'completed' ? 'default' : 'outline'}>{p.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-10 text-center border-2 border-dashed rounded-lg">
              <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
              <p className="text-muted-foreground">No transactions found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default Payments
