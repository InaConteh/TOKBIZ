import { useEffect, useState } from 'react'
import { Receipt, AlertCircle, Plus, Calendar, Tag } from 'lucide-react'
import api from '../services/api'
import type { Expense } from '../types'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setIsLoading(true)
        const response = await api.getExpenses()
        setExpenses(response.data.expenses)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load expenses.')
      } finally {
        setIsLoading(false)
      }
    }
    loadExpenses()
  }, [])

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">Track and manage your business expenditures.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Record Expense
          </Button>
        </div>

        {error && (
          <Badge variant="destructive" className="py-2 px-4 gap-2 h-auto text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Badge>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>A detailed list of your business expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center animate-pulse text-muted-foreground">
                Loading expenses...
              </div>
            ) : expenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{expense.description}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1 font-normal">
                          <Tag className="h-3 w-3" />
                          {expense.category || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {expense.currency} {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {expense.paid ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Paid</Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center border-2 border-dashed rounded-lg">
                <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-muted-foreground">No expenses recorded yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Expenses
