import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import AgentsPage from './pages/AgentsPage'
import FarmersPage from './pages/FarmersPage'
import BuyersPage from './pages/BuyersPage'
import PurchasesPage from './pages/PurchasesPage'
import SalesPage from './pages/SalesPage'
import StockPage from './pages/StockPage'
import NotificationsPage from './pages/NotificationsPage'
import ReportsPage from './pages/ReportsPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './pages/Layout'
import { getAccessToken } from './api'

const isAuthenticated = () => !!getAccessToken()

function App() {
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated() ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="/" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<DashboardPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="farmers" element={<FarmersPage />} />
        <Route path="buyers" element={<BuyersPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  )
}

export default App
