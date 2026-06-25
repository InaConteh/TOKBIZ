import { useEffect, useState } from 'react'
import { Truck, Mail, Phone, User, AlertCircle, Plus } from 'lucide-react'
import api from '../services/api'
import type { Supplier } from '../types'
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

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setIsLoading(true)
        const response = await api.getSuppliers()
        setSuppliers(response.data.suppliers)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load suppliers.')
      } finally {
        setIsLoading(false)
      }
    }
    loadSuppliers()
  }, [])

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">Manage your relationships with product suppliers.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Supplier
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
            <CardTitle>Supplier Directory</CardTitle>
            <CardDescription>A list of all registered suppliers for your business.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center animate-pulse text-muted-foreground">
                Loading suppliers...
              </div>
            ) : suppliers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        {supplier.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {supplier.contact_name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {supplier.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {supplier.email}
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {supplier.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            {supplier.phone}
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-10 text-center border-2 border-dashed rounded-lg">
                <Truck className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-20" />
                <p className="text-muted-foreground">No suppliers found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Suppliers
