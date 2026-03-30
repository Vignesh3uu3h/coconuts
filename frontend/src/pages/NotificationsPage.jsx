import { useEffect, useState } from 'react'
import api from '../api'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    api.get('notifications/').then((res) => setNotifications(res.data)).catch(() => setNotifications([]))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Notifications</h1>
      <div className="space-y-3">
        {notifications.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            No notifications right now.
          </div>
        )}

        {notifications.map((notification) => (
          <div key={notification.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold">Agent: {notification.agent?.name || 'N/A'}</p>
            <p className="text-sm text-slate-600">Farmer: {notification.farmer?.name || 'N/A'}</p>
            <p className="mt-2 text-sm">{notification.message}</p>
            <p className="mt-2 text-xs text-slate-500">
              {notification.reminderDate || notification.date} | {notification.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
