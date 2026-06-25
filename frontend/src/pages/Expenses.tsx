import { useEffect, useState } from 'react'
import api from '../services/api'
import type { Expense } from '../types'

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await api.getExpenses()
        setExpenses(response.data.expenses)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load expenses.')
      }
    }
    loadExpenses()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Expenses</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="grid gap-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="rounded border p-4">
            <h2 className="text-xl font-semibold">{expense.description}</h2>
            <p>{expense.category || 'Uncategorized'} - {expense.currency} {expense.amount.toFixed(2)}</p>
            <p>{expense.paid ? 'Paid' : 'Pending'}</p>
          </div>
        ))}
        {expenses.length === 0 && <p>No expenses recorded yet.</p>}
      </div>
    </div>
  )
}

export default Expenses
