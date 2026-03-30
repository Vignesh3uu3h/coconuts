import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import api, { clearAuthTokens, getAccessToken } from '../api'

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
  const [showNotifyCard, setShowNotifyCard] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [notificationPreview, setNotificationPreview] = useState('')

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = getAccessToken()
        if (!token) return

        const seenKey = `notif_seen_${token.slice(-12)}`
        const alreadySeen = sessionStorage.getItem(seenKey) === '1'

        const res = await api.get('notifications/')
        const list = Array.isArray(res.data) ? res.data : []
        setNotificationCount(list.length)

        if (list.length > 0) {
          setNotificationPreview(list[0]?.message || 'You have new updates.')
        }

        if (list.length > 0 && !alreadySeen) {
          setShowNotifyCard(true)
          sessionStorage.setItem(seenKey, '1')
        }
      } catch {
        setNotificationCount(0)
      }
    }

    loadNotifications()
  }, [])

  const logout = () => {
    clearAuthTokens()
    try {
      sessionStorage.clear()
    } catch {
      // ignore session storage cleanup errors
    }
    window.location.replace('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 md:hidden">
        <div className="text-lg font-semibold">தேங்காய் வாடி</div>
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
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 overflow-y-auto border-r border-slate-200 bg-white p-6 transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between md:hidden">
            <div className="text-xl font-semibold">Menu</div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700"
            >
              Close
            </button>
          </div>
          <div className="mb-6 text-xl font-semibold">தேங்காய் வாடி</div>
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
        <main className="relative flex-1 p-8">
          {showNotifyCard && (
            <div className="fixed right-4 top-4 z-40 w-[92vw] max-w-sm rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">New Notifications</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    You have {notificationCount} notification{notificationCount === 1 ? '' : 's'}.
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{notificationPreview}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifyCard(false)}
                  className="rounded-md bg-white px-2 py-1 text-xs text-slate-600"
                >
                  Close
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifyCard(false)}
                  className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  View Notifications
                </Link>
                <button
                  type="button"
                  onClick={() => setShowNotifyCard(false)}
                  className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Later
                </button>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  )
}
