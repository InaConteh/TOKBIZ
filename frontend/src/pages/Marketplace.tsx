import { useEffect, useState } from 'react'
import { ShoppingBag, Store, Search, Filter, AlertCircle, TrendingUp } from 'lucide-react'
import api from '../services/api'
import type { MarketplaceListing } from '../types'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Marketplace = () => {
  const [items, setItems] = useState<MarketplaceListing[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMarketplace = async () => {
      try {
        setIsLoading(true)
        const response = await api.getMarketplaceListings()
        setItems(response.data.marketplace_listings || [])
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load marketplace.')
      } finally {
        setIsLoading(false)
      }
    }
    loadMarketplace()
  }, [])

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">Discover products and connect with other businesses in Sierra Leone.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search marketplace..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {error && (
          <Badge variant="destructive" className="py-2 px-4 gap-2 h-auto text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </Badge>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="wholesale">Wholesale</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-lg" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-1" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <Badge variant="secondary">Le {item.price}</Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Store className="h-3 w-3" /> Business #{item.business_id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description || "No description available for this item."}
                      </p>
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-4">
                      <Button className="w-full">Contact Seller</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed rounded-xl">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Marketplace is empty</h3>
                <p className="text-muted-foreground">Be the first to list your products here!</p>
                <Button className="mt-4 gap-2">
                  <TrendingUp className="h-4 w-4" /> List a Product
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="wholesale">
            <div className="py-20 text-center text-muted-foreground italic">
              Wholesale section coming soon.
            </div>
          </TabsContent>
          <TabsContent value="services">
            <div className="py-20 text-center text-muted-foreground italic">
              Services section coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default Marketplace
