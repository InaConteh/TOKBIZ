import { useState } from 'react'
import { Key, Copy, Check, Terminal, ExternalLink } from 'lucide-react'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DeveloperAPI = () => {
  const [apiKey] = useState('tb_live_51NyX9BHz8L0Q7e1R2u3V4w5X6y7Z8a9B')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Layout>
      <PageHeader
        title="Developer API"
        description="Integrate TokBiz with your own applications and services."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>Use these keys to authenticate your API requests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Secret Key</label>
                <div className="flex gap-2">
                  <div className="flex-1 font-mono text-sm p-2 bg-muted rounded-md border flex items-center justify-between">
                    <span>{apiKey.substring(0, 10)}************************</span>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button variant="outline">Regenerate</Button>
                </div>
                <p className="text-xs text-muted-foreground">Keep this key secret and never share it in client-side code.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="curl" className="mt-4">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 text-sm overflow-x-auto">
                    <code>
{`curl -X GET https://api.tokbiz.sl/v1/inventory \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                    </code>
                  </pre>
                </TabsContent>
                <TabsContent value="nodejs" className="mt-4">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 text-sm overflow-x-auto">
                    <code>
{`const axios = require('axios');

axios.get('https://api.tokbiz.sl/v1/inventory', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
}).then(response => console.log(response.data));`}
                    </code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="px-0 gap-1">
                View full documentation <ExternalLink className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm opacity-90">
              Our developer support team is available 24/7 to help you with your integration.
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">Contact Support</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">All systems operational</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default DeveloperAPI
