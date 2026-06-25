import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl p-8 rounded-xl border bg-white shadow-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome to TokBiz</h1>
        <p className="mb-6 text-slate-600">
          Manage your business, inventory, sales, and debt with AI-powered insights.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded border px-4 py-2 text-slate-700"
          >
            Register
          </Link>
          <Link
            to="/ai"
            className="rounded bg-indigo-600 px-4 py-2 text-white"
          >
            AI Insights
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            to="/suppliers"
            className="rounded border px-4 py-2 text-slate-700 text-center"
          >
            Suppliers
          </Link>
          <Link
            to="/expenses"
            className="rounded border px-4 py-2 text-slate-700 text-center"
          >
            Expenses
          </Link>
          <Link
            to="/payments"
            className="rounded border px-4 py-2 text-slate-700 text-center"
          >
            Payments
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
