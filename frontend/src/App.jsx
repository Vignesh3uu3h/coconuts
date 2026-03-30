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
import { isAuthenticated } from './api'

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
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

      <Route path="*" element={<Navigate to={isAuthenticated() ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
