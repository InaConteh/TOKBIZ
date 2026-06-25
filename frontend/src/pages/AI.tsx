import { useState } from 'react'
import { Sparkles, BrainCircuit, AlertCircle, TrendingUp, Wallet, Package, HeartPulse } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const AI = () => {
  const [insight, setInsight] = useState('')
  const [type, setType] = useState<'sales' | 'debt' | 'inventory' | 'health'>('sales')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRun = async () => {
    setError('')
    setLoading(true)
    setInsight('')

    try {
      const response = await api[
        type === 'sales'
          ? 'getSalesInsights'
          : type === 'debt'
          ? 'getDebtRisks'
          : type === 'inventory'
          ? 'getInventoryForecast'
          : 'getHealthScore'
      ]({})
      setInsight(response.data.insights || response.data.risks || response.data.forecast || response.data.health_score)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to retrieve AI insights.')
    } finally {
      setLoading(false)
    }
  }

  const options = [
    { id: 'sales', label: 'Sales Insights', icon: TrendingUp },
    { id: 'debt', label: 'Debt Risk', icon: Wallet },
    { id: 'inventory', label: 'Inventory Forecast', icon: Package },
    { id: 'health', label: 'Health Score', icon: HeartPulse },
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Business Assistant
          </h1>
          <p className="text-muted-foreground">
            Leverage advanced AI to gain deep insights into your business performance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {options.map((opt) => (
            <Card
              key={opt.id}
              className={`cursor-pointer transition-colors hover:bg-accent/50 ${type === opt.id ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => setType(opt.id as any)}
            >
              <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{opt.label}</CardTitle>
                <opt.icon className={`h-4 w-4 ${type === opt.id ? 'text-primary' : 'text-muted-foreground'}`} />
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleRun}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <BrainCircuit className="h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
            {loading ? 'Analyzing Data...' : 'Generate Analysis'}
          </Button>
        </div>

        {error && (
          <Badge variant="destructive" className="w-full py-3 px-4 gap-2 h-auto text-sm justify-center">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Badge>
        )}

        {insight && (
          <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                AI Analysis Results
              </CardTitle>
              <CardDescription>
                Based on your current business data and market trends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-6 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {insight}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground italic">
              AI-generated content may contain inaccuracies. Please verify with your actual records.
            </CardFooter>
          </Card>
        )}

        {!insight && !loading && !error && (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <BrainCircuit className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">Select a category and click "Generate Analysis" to start.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AI
