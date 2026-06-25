import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Permission, Role } from '../types'

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAccessData = async () => {
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          api.getRoles(),
          api.getPermissions(),
        ])

        setRoles(rolesResponse.data.roles)
        setPermissions(permissionsResponse.data.permissions)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load roles and permissions.')
      }
    }
    loadAccessData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Roles & Permissions</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border p-4">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          {roles.length === 0 ? (
            <p>No roles available.</p>
          ) : (
            <ul className="space-y-3">
              {roles.map((role) => (
                <li key={role.id} className="rounded bg-slate-50 p-3">
                  <p className="font-semibold">{role.name}</p>
                  <p>{role.description || 'No description'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded border p-4">
          <h2 className="text-xl font-semibold mb-4">Permissions</h2>
          {permissions.length === 0 ? (
            <p>No permissions available.</p>
          ) : (
            <ul className="space-y-3">
              {permissions.map((permission) => (
                <li key={permission.id} className="rounded bg-slate-50 p-3">
                  <p className="font-semibold">{permission.name}</p>
                  <p>{permission.description || 'No description'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Roles
