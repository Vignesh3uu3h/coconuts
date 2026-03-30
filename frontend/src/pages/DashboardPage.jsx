import { useEffect, useState } from 'react'
import api from '../api'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const formatINR = (value) => `\u20B9 ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  useEffect(() => {
    api.get('dashboard/summary/').then((res) => setSummary(res.data)).catch(() => setSummary(null))
  }, [])

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-lime-50 to-amber-50 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-emerald-900">Coconut Dashboard</h1>
        <p className="mt-2 max-w-3xl text-emerald-900/80">
          Track buying agents, farmers, warehouse stock, and sales in one place. The system also supports automatic reminders when a farmer is due to supply coconuts every two months.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-amber-800">Today Purchases</p>
          <p className="mt-4 text-3xl font-semibold text-amber-950">{summary ? formatINR(summary.today_purchases) : '...'}</p>
          <p className="mt-2 text-sm text-amber-800">Qty: {summary ? summary.today_purchase_qty : '...'}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-100 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-emerald-800">Today Sales</p>
          <p className="mt-4 text-3xl font-semibold text-emerald-950">{summary ? formatINR(summary.today_sales) : '...'}</p>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-100 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-teal-800">Current Stock</p>
          <p className="mt-4 text-3xl font-semibold text-teal-950">{summary ? summary.current_stock : '...'}</p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-emerald-900">Agent Management</h2>
          <p className="text-sm text-slate-700">
            Use the Agents page to manage all buying agents, their contact details, commission, and assigned farmers.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-amber-900">Farmer Supply Cycle</h2>
          <p className="text-sm text-slate-700">
            Whenever a farmer supplies coconuts, update their last supply date. The system calculates next supply date automatically and triggers reminders before the two-month interval completes.
          </p>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-teal-900">Warehouse Tracking</h2>
          <p className="text-sm text-slate-700">
            Every purchase adds stock and every sale reduces stock. This prevents selling the same coconuts twice and keeps warehouse totals accurate.
          </p>
        </div>
      </section>
    </div>
  )
}
