import { useEffect, useState } from 'react'
import api from '../api'

export default function ReportsPage() {
  const [reports, setReports] = useState({ monthly: null, agents: null, farmers: null })

  useEffect(() => {
    api.get('reports/monthly/').then((res) => setReports((prev) => ({ ...prev, monthly: res.data })))
    api.get('reports/agents/').then((res) => setReports((prev) => ({ ...prev, agents: res.data })))
    api.get('reports/farmers/').then((res) => setReports((prev) => ({ ...prev, farmers: res.data })))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Reports</h1>
      <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Monthly</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-700">{reports.monthly ? JSON.stringify(reports.monthly, null, 2) : 'Loading...'}</pre>
      </section>
      <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Agents</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-700">{reports.agents ? JSON.stringify(reports.agents, null, 2) : 'Loading...'}</pre>
      </section>
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Farmers</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-700">{reports.farmers ? JSON.stringify(reports.farmers, null, 2) : 'Loading...'}</pre>
      </section>
    </div>
  )
}
