import { useEffect, useState } from 'react'
import api from '../api'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    api.get('dashboard/summary/').then((res) => setSummary(res.data)).catch(() => setSummary(null))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Thengai Vaati Management Dashboard</h1>
      <p className="mb-6 max-w-3xl text-slate-600">
        Track buying agents, farmers, warehouse stock, and sales in one place. The system also supports automatic reminders when a farmer is due to supply coconuts every two months.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Today Purchases</p>
          <p className="mt-4 text-3xl font-semibold">{summary ? summary.today_purchases : '...'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Today Sales</p>
          <p className="mt-4 text-3xl font-semibold">{summary ? summary.today_sales : '...'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Current Stock</p>
          <p className="mt-4 text-3xl font-semibold">{summary ? summary.current_stock : '...'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Monthly Profit</p>
          <p className="mt-4 text-3xl font-semibold">{summary ? summary.monthly_profit : '...'}</p>
        </div>
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Agent Management</h2>
          <p className="text-slate-600 text-sm">
            Use the Agents page to manage all buying agents, their contact details, commission, and assigned farmers.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Farmer Supply Cycle</h2>
          <p className="text-slate-600 text-sm">
            Whenever a farmer supplies coconuts, update their last supply date. The system calculates next supply date automatically and triggers reminders before the two-month interval completes.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Warehouse Tracking</h2>
          <p className="text-slate-600 text-sm">
            Every purchase adds stock and every sale reduces stock. This prevents selling the same coconuts twice and keeps warehouse totals accurate.
          </p>
        </div>
      </section>
    </div>
  )
}
