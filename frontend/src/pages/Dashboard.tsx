import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  DollarSign,
  Wallet,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import api from '../services/api'
import type { AnalyticsSummary } from '../types'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.getAnalyticsSummary()
        setSummary(response.data.summary)
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token')
          navigate('/login')
          return
        }
        setError(err.response?.data?.message || 'Unable to load dashboard.')
      }
    }
    loadSummary()
  }, [navigate])

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your business today.</p>
        </div>

        {error && (
          <Badge variant="destructive" className="py-2 px-4 gap-2 h-auto text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Badge>
        )}

        {summary ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Le {summary.total_revenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500 flex items-center font-medium">
                      <ArrowUpRight className="h-3 w-3" /> +12.5%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.total_sales}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-green-500 flex items-center font-medium">
                      <ArrowUpRight className="h-3 w-3" /> +4.2%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Outstanding Debt</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Le {summary.total_debt.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-red-500 flex items-center font-medium">
                      <ArrowUpRight className="h-3 w-3" /> +2.1%
                    </span>{" "}
                    increase
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Le {summary.inventory_value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-red-500 flex items-center font-medium">
                      <ArrowDownRight className="h-3 w-3" /> -5.4%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>Visual representation of your sales performance.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground italic border-t pt-4">
                    Sales chart will be rendered here.
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks you might want to do.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button variant="outline" className="justify-start gap-2" asChild>
                    <a href="/expenses">Record New Expense</a>
                  </Button>
                  <Button variant="outline" className="justify-start gap-2" asChild>
                    <a href="/invoices">Generate Invoice</a>
                  </Button>
                  <Button variant="outline" className="justify-start gap-2" asChild>
                    <a href="/ai">Get AI Business Analysis</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground animate-pulse">Loading dashboard summary...</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
