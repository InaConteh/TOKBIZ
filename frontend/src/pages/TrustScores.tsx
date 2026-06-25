import { useEffect, useState } from 'react'
import { ShieldCheck, TrendingUp, Info, UserCheck, UserX } from 'lucide-react'
import api from '../services/api'
import type { TrustScore } from '../types'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const TrustScores = () => {
  const [scores, setScores] = useState<TrustScore[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadScores = async () => {
      try {
        setIsLoading(true)
        const response = await api.getTrustScores()
        setScores(response.data.trust_scores || [])
      } catch (err: any) {
        setError('Unable to load trust scores.')
      } finally {
        setIsLoading(false)
      }
    }
    loadScores()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Layout>
      <PageHeader
        title="Trust Scores"
        description="Verify the reliability of businesses and customers."
        error={error}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Your Business Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="text-6xl font-extrabold text-primary mb-2">85</div>
            <p className="text-sm font-medium text-primary/80">Excellent Reliability</p>
            <div className="mt-4 flex justify-center">
              <Badge className="bg-primary/20 text-primary border-none">Top 10% in Freetown</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>Trust scores are calculated based on multiple factors.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2 rounded-lg"><TrendingUp className="h-4 w-4" /></div>
              <div>
                <p className="text-sm font-medium">Payment Consistency</p>
                <p className="text-xs text-muted-foreground">Paying suppliers on time significantly boosts your score.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-muted p-2 rounded-lg"><UserCheck className="h-4 w-4" /></div>
              <div>
                <p className="text-sm font-medium">Customer Feedback</p>
                <p className="text-xs text-muted-foreground">Positive interactions with customers improve your rating.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Trust Ratings</CardTitle>
          <CardDescription>Review the scores of your frequent business partners.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="py-10 text-center animate-pulse text-muted-foreground">Loading scores...</div>
          ) : scores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trust Score</TableHead>
                  <TableHead className="text-right">Reliability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((s) => (
                  <TableRow key={s.business_id}>
                    <TableCell className="font-medium">{s.business_name}</TableCell>
                    <TableCell>
                      {s.trust_score >= 50 ? (
                        <Badge className="bg-green-500/10 text-green-500 border-none flex w-fit items-center gap-1">
                          <UserCheck className="h-3 w-3" /> Trusted
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex w-fit items-center gap-1">
                          <UserX className="h-3 w-3" /> High Risk
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${s.trust_score >= 80 ? 'bg-green-500' : s.trust_score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${s.trust_score}%` }}
                          />
                        </div>
                        <span className={`font-bold ${getScoreColor(s.trust_score)}`}>{s.trust_score}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-20 text-center">
              <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No partner data available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  )
}

export default TrustScores
