import { useEffect, useState } from 'react'
import api from '../api'

export default function FarmersPage() {
  const [agents, setAgents] = useState([])
  const [purchases, setPurchases] = useState([])
  const [agentFarmers, setAgentFarmers] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [selectedFarmer, setSelectedFarmer] = useState(null)

  const read = (obj, ...keys) => {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key]
    }
    return null
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [agentRes, purchaseRes] = await Promise.all([
          api.get('agents/'),
          api.get('purchases/'),
        ])
        setAgents(agentRes.data || [])
        setPurchases(purchaseRes.data || [])
      } catch {
        setAgents([])
        setPurchases([])
      }
    }

    load()
  }, [])

  const handleAgentSelect = async (agent) => {
    setSelectedAgent(agent)
    setSelectedFarmer(null)
    try {
      const res = await api.get(`agents/${agent.id}/`)
      setAgentFarmers(res.data?.farmers || [])
    } catch {
      setAgentFarmers([])
    }
  }

  const getFarmerHistory = (farmerId) => {
    return purchases
      .filter((purchase) => Number(read(purchase, 'farmerId', 'farmer_id', 'farmer_id_id')) === Number(farmerId))
      .sort((a, b) => new Date(read(b, 'date') || 0) - new Date(read(a, 'date') || 0))
  }

  const selectedFarmerHistory = selectedFarmer ? getFarmerHistory(selectedFarmer.id) : []
  const totalQuantity = selectedFarmerHistory.reduce(
    (sum, purchase) => sum + Number(read(purchase, 'numberOfCoconuts', 'number_of_coconuts') || 0),
    0
  )
  const paidAmount = selectedFarmerHistory.reduce((sum, purchase) => {
    const status = String(read(purchase, 'paymentStatus', 'payment_status') || '')
    if (status.toLowerCase() !== 'paid') return sum
    return sum + Number(read(purchase, 'totalAmount', 'total_amount') || 0)
  }, 0)
  const totalAmount = selectedFarmerHistory.reduce(
    (sum, purchase) => sum + Number(read(purchase, 'totalAmount', 'total_amount') || 0),
    0
  )
  const pendingAmount = totalAmount - paidAmount

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Farmers</h1>
      <p className="mb-6 max-w-3xl text-slate-600">
        Select an agent to view assigned farmers. Then click a farmer to see coconut quantity and payment history.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Agents</h2>
          <div className="space-y-2">
            {agents.length === 0 && <p className="text-sm text-slate-600">No agents found.</p>}
            {agents.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleAgentSelect(agent)}
                className={`w-full rounded-md border px-3 py-2 text-left ${
                  selectedAgent?.id === agent.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <p className="font-medium">{agent.name}</p>
                <p className={`text-xs ${selectedAgent?.id === agent.id ? 'text-slate-200' : 'text-slate-500'}`}>
                  {agent.phone || 'No phone'}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Assigned Farmers</h2>
          {!selectedAgent && <p className="text-sm text-slate-600">Click an agent to load farmers.</p>}
          {selectedAgent && agentFarmers.length === 0 && (
            <p className="text-sm text-slate-600">No farmers assigned to {selectedAgent.name}.</p>
          )}
          <div className="space-y-2">
            {agentFarmers.map((farmer) => (
              <button
                key={farmer.id}
                type="button"
                onClick={() => setSelectedFarmer(farmer)}
                className={`w-full rounded-md border px-3 py-2 text-left ${
                  selectedFarmer?.id === farmer.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <p className="font-medium">{farmer.name}</p>
                <p className={`text-xs ${selectedFarmer?.id === farmer.id ? 'text-slate-200' : 'text-slate-500'}`}>
                  {farmer.village || 'Village not set'}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Farmer History</h2>
          {!selectedFarmer && <p className="text-sm text-slate-600">Click a farmer to view history.</p>}
          {selectedFarmer && (
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold">{selectedFarmer.name}</p>
                <p className="text-sm text-slate-600">Total Quantity: {totalQuantity}</p>
                <p className="text-sm text-slate-600">Paid Amount: {paidAmount.toFixed(2)}</p>
                <p className="text-sm text-slate-600">Pending Amount: {pendingAmount.toFixed(2)}</p>
              </div>
              {selectedFarmerHistory.length === 0 && (
                <p className="text-sm text-slate-600">No purchase history found for this farmer.</p>
              )}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {selectedFarmerHistory.map((purchase) => (
                  <div key={purchase.id} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
                    <p>Date: {read(purchase, 'date') || 'N/A'}</p>
                    <p>Quantity: {read(purchase, 'numberOfCoconuts', 'number_of_coconuts') || 0}</p>
                    <p>Amount: {Number(read(purchase, 'totalAmount', 'total_amount') || 0).toFixed(2)}</p>
                    <p>Status: {read(purchase, 'paymentStatus', 'payment_status') || 'Pending'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
