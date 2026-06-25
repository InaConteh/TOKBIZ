import { Link } from 'react-router-dom'
import { TrendingUp, ShieldCheck, Sparkles, Box, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-primary text-xl">
          <TrendingUp className="h-6 w-6" />
          <span>TokBiz</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Empower Your Business with <span className="text-primary">AI Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            The all-in-one platform for MSMEs in Sierra Leone to track sales, manage inventory,
            and build trust through data-driven insights.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link to="/register">
                Start for Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/ai">Explore AI Insights</Link>
            </Button>
          </div>
        </section>

        <section className="py-20 bg-muted/50 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get intelligent recommendations for restocking and identify your most profitable products.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Trust & Credit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage customer debts efficiently and build a digital trust score for your business.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Box className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Inventory Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Real-time tracking of stock levels with automated alerts to prevent stockouts.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TokBiz. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Home
