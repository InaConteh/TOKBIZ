import { useEffect, useState } from 'react'
import { RotateCcw, Plus, Calendar } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const RecurringExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setIsLoading(true)
        const response = await api.getRecurringExpenses()
        setExpenses(response.data.expenses || [])
      } catch (err: any) {
        setError('Unable to load recurring expenses.')
      } finally {
        setIsLoading(false)
      }
    }
    loadExpenses()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Recurring Expenses"
        description="Manage your subscription and automated business costs."
        error={error}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Recurring
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Costs</CardTitle>
          <CardDescription>Costs that occur on a regular basis (monthly/yearly).</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center animate-pulse text-muted-foreground">Loading...</div>
          ) : expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{exp.name}</TableCell>
                    <TableCell>
                       <Badge variant="secondary" className="capitalize">{exp.frequency}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" /> {new Date(exp.next_payment_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>Le {exp.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                       <Badge className="bg-green-500/10 text-green-500 border-none">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-xl">
              <RotateCcw className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No recurring expenses found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default RecurringExpenses
