import { useEffect, useState } from 'react'
import api from '../services/api'
import type { RecurringExpense } from '../types'

const RecurringExpenses = () => {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const response = await api.getRecurringExpenses()
        setExpenses(response.data.recurring_expenses)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Unable to load recurring expenses.')
      }
    }
    loadExpenses()
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Recurring Expenses</h1>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {expenses.length === 0 ? (
        <p>No recurring expenses scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="rounded border p-4">
              <p className="font-semibold">{expense.description}</p>
              <p>Amount: {expense.amount.toFixed(2)} {expense.currency}</p>
              <p>Frequency: {expense.frequency}</p>
              <p>Next Due Date: {expense.next_due_date}</p>
              <p>Status: {expense.active ? 'Active' : 'Inactive'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecurringExpenses
