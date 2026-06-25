import { useEffect, useState } from 'react'
import { ShieldCheck, Plus, Users, Key, Settings } from 'lucide-react'
import api from '../services/api'
import { Layout } from '@/components/layout'
import { PageHeader } from '@/components/common/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const Roles = () => {
  const [roles, setRoles] = useState<any[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true)
        const response = await api.getRoles()
        setRoles(response.data.roles || [])
      } catch (err: any) {
        setError('Unable to load roles.')
      } finally {
        setIsLoading(false)
      }
    }
    loadRoles()
  }, [])

  return (
    <Layout>
      <PageHeader
        title="Roles & Permissions"
        description="Control access levels for your team members."
        error={error}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Role
        </Button>
      </PageHeader>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Business Roles</CardTitle>
              <CardDescription>Defined roles and their basic configurations.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-10 text-center animate-pulse text-muted-foreground">Loading roles...</div>
              ) : roles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>
                           <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {role.user_count || 0}
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant={role.name === 'Admin' ? 'default' : 'secondary'}>
                              {role.name === 'Admin' ? 'Full Access' : 'Limited Access'}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  No custom roles defined yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> 2FA Status
              </span>
              <Badge variant="outline" className="text-green-500 border-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Key className="h-4 w-4" /> Password Policy
              </span>
              <span className="font-medium">Strong</span>
            </div>
            <hr />
            <Button variant="outline" className="w-full justify-start gap-2">
               <Settings className="h-4 w-4" /> Security Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Roles
