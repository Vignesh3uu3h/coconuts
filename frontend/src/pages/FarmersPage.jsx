import { useEffect, useState } from 'react'
import api from '../api'

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([])

  useEffect(() => {
    api.get('farmers/').then((res) => setFarmers(res.data)).catch(() => setFarmers([]))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Farmers</h1>
      <p className="mb-6 max-w-3xl text-slate-600">
        Track your farmer suppliers with next supply dates, assigned agents, and notes. The system automatically calculates the next supply date as two months after the last supply.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {farmers.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-yellow-50 p-4 text-slate-700">
            No farmers found yet. Add farmer records through the backend API or import them into the system.
          </div>
        )}
        {farmers.map((farmer) => (
          <div key={farmer.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{farmer.name}</h2>
            <div className="mt-2 grid gap-2 text-sm text-slate-600">
              <p>Village: {farmer.village}</p>
              <p>Agent: {farmer.assigned_agent_name || 'Unassigned'}</p>
              <p>Last supply: {farmer.last_supply_date || 'Not recorded'}</p>
              <p>Next supply: {farmer.next_supply_date || 'Pending'}</p>
            </div>
            {farmer.notes && <p className="mt-3 text-sm text-slate-500">Notes: {farmer.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
