import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { clearAuthTokens } from '../api'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/agents', label: 'Agents' },
  { path: '/farmers', label: 'Farmers' },
  { path: '/buyers', label: 'Buyers' },
  { path: '/purchases', label: 'Purchases' },
  { path: '/sales', label: 'Sales' },
  { path: '/stock', label: 'Stock' },
  { path: '/notifications', label: 'Notifications' },
  { path: '/reports', label: 'Reports' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    clearAuthTokens()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white p-4 flex items-center justify-between md:hidden">
        <div className="text-lg font-semibold">Coconut Management</div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        >
          Menu
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 overflow-y-auto bg-white border-r border-slate-200 p-6 transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between md:hidden mb-6">
            <div className="text-xl font-semibold">Menu</div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
            >
              Close
            </button>
          </div>
          <div className="text-xl font-semibold mb-6">Coconut Management</div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button onClick={logout} className="mt-8 w-full rounded bg-slate-900 px-3 py-2 text-white">Logout</button>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
