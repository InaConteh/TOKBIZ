import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AI from './pages/AI'
import Suppliers from './pages/Suppliers'
import Expenses from './pages/Expenses'
import Payments from './pages/Payments'
import Invoices from './pages/Invoices'
import Notifications from './pages/Notifications'
import ExchangeRates from './pages/ExchangeRates'
import PaymentChannels from './pages/PaymentChannels'
import RecurringExpenses from './pages/RecurringExpenses'
import Roles from './pages/Roles'
import Marketplace from './pages/Marketplace'
import Partners from './pages/Partners'
import Recommendations from './pages/Recommendations'
import TrustScores from './pages/TrustScores'
import DeveloperAPI from './pages/DeveloperAPI'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/exchange-rates" element={<ExchangeRates />} />
        <Route path="/payment-channels" element={<PaymentChannels />} />
        <Route path="/recurring-expenses" element={<RecurringExpenses />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/trust" element={<TrustScores />} />
        <Route path="/developer-api" element={<DeveloperAPI />} />
      </Routes>
    </Router>
  )
}

export default App
