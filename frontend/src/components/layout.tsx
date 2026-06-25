import * as React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Box,
  TrendingUp,
  Wallet,
  Bell,
  LogOut,
  Sparkles,
  CreditCard,
  Receipt,
  Truck,
  ShieldCheck,
  Code2,
  Menu,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Repeat,
  Share2,
  Lightbulb,
  CreditCard as PaymentIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Sparkles, label: "AI Insights", href: "/ai" },
  { icon: Package, label: "Inventory", href: "/products" },
  { icon: ShoppingCart, label: "Sales", href: "/sales" },
  { icon: Users, label: "Debtors", href: "/debtors" },
  { icon: Truck, label: "Suppliers", href: "/suppliers" },
  { icon: Receipt, label: "Expenses", href: "/expenses" },
  { icon: Repeat, label: "Recurring", href: "/recurring-expenses" },
  { icon: Wallet, label: "Payments", href: "/payments" },
  { icon: PaymentIcon, label: "Channels", href: "/payment-channels" },
  { icon: CreditCard, label: "Invoices", href: "/invoices" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: TrendingUp, label: "Exchange Rates", href: "/exchange-rates" },
  { icon: Box, label: "Marketplace", href: "/marketplace" },
  { icon: Share2, label: "Partners", href: "/partners" },
  { icon: Lightbulb, label: "Recommendations", href: "/recommendations" },
  { icon: ShieldCheck, label: "Trust Scores", href: "/trust" },
  { icon: Settings, label: "Roles", href: "/roles" },
  { icon: Code2, label: "Developer API", href: "/developer-api" },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform lg:static lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary">
            <TrendingUp className="h-6 w-6" />
            <span>TokBiz</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t p-4 space-y-2 bg-card">
          <ModeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              JD
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
