import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
  error?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, error, children }: PageHeaderProps) {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
      {error && (
        <Badge variant="destructive" className="py-2 px-4 gap-2 h-auto text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </Badge>
      )}
    </div>
  )
}
