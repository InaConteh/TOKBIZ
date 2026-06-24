import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Placeholder pages
const Home = () => <div className="p-8"><h1 className="text-3xl font-bold">Welcome to TokBiz</h1></div>
const Login = () => <div className="p-8"><h1 className="text-3xl font-bold">Login Page</h1></div>
const Register = () => <div className="p-8"><h1 className="text-3xl font-bold">Register Page</h1></div>
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard</h1></div>

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
