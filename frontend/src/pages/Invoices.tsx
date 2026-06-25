import { useEffect, useState } from 'react'
import { Receipt, Plus } from 'lucide-react'
import api from '../services/api'
import type { Invoice } from '../types'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setIsLoading(true)
        const response = await api.getInvoices()
        setInvoices(response.data.invoices || [])
      } catch (err: any) {
        setError('Unable to load invoices.')
      } finally {
        setIsLoading(false)
      }
    }
    loadInvoices()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Invoices"
        description="Generate and manage invoices for your clients."
        error={error}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>Track the status of your issued invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center animate-pulse text-muted-foreground">Loading invoices...</div>
          ) : invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.description}</TableCell>
                    <TableCell>{new Date(inv.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>{inv.currency} {inv.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={inv.paid ? 'default' : 'outline'}>
                        {inv.paid ? 'Paid' : inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-xl">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No invoices yet</h3>
              <p className="text-muted-foreground">Create your first professional invoice today.</p>
              <Button className="mt-4">Create Invoice</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default Invoices
