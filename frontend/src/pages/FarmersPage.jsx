import { useEffect, useState } from 'react'
import api from '../api'

export default function FarmersPage() {
  const [agents, setAgents] = useState([])
  const [purchases, setPurchases] = useState([])
  const [agentFarmers, setAgentFarmers] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [mobileStep, setMobileStep] = useState('agents')
  const [historyModalOpen, setHistoryModalOpen] = useState(false)

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
    setMobileStep('farmers')
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
  const formatINR = (value) => `\u20B9 ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Farmers</h1>
      <p className="mb-6 max-w-3xl text-slate-600">
        Select an agent to view assigned farmers. Then click a farmer to see coconut quantity and payment history.
      </p>
      <div className="mb-4 grid grid-cols-3 gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileStep('agents')}
          className={`rounded-lg px-3 py-2 text-xs font-medium ${mobileStep === 'agents' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          1. Agents
        </button>
        <button
          type="button"
          onClick={() => selectedAgent && setMobileStep('farmers')}
          className={`rounded-lg px-3 py-2 text-xs font-medium ${mobileStep === 'farmers' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'} ${!selectedAgent ? 'opacity-50' : ''}`}
        >
          2. Farmers
        </button>
        <button
          type="button"
          onClick={() => selectedFarmer && setMobileStep('history')}
          className={`rounded-lg px-3 py-2 text-xs font-medium ${mobileStep === 'history' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'} ${!selectedFarmer ? 'opacity-50' : ''}`}
        >
          3. History
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${mobileStep === 'agents' ? 'block' : 'hidden'} lg:block`}>
          <h2 className="text-lg font-semibold mb-3">Agents ({agents.length})</h2>
          <div className="space-y-2">
            {agents.length === 0 && <p className="text-sm text-slate-600">No agents found.</p>}
            {agents.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => handleAgentSelect(agent)}
                className={`w-full rounded-lg border px-4 py-3 text-left ${
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

        <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${mobileStep === 'farmers' ? 'block' : 'hidden'} lg:block`}>
          <h2 className="text-lg font-semibold mb-3">Assigned Farmers ({agentFarmers.length})</h2>
          {!selectedAgent && <p className="text-sm text-slate-600">Click an agent to load farmers.</p>}
          {selectedAgent && agentFarmers.length === 0 && (
            <p className="text-sm text-slate-600">No farmers assigned to {selectedAgent.name}.</p>
          )}
          <div className="space-y-2">
            {agentFarmers.map((farmer) => (
              <button
                key={farmer.id}
                type="button"
                onClick={() => {
                  setSelectedFarmer(farmer)
                  setMobileStep('history')
                  setHistoryModalOpen(true)
                }}
                className={`w-full rounded-lg border px-4 py-3 text-left ${
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

        <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${mobileStep === 'history' ? 'block' : 'hidden'} lg:block`}>
          <h2 className="text-lg font-semibold mb-3">Farmer History</h2>
          {!selectedFarmer && <p className="text-sm text-slate-600">Click a farmer to view history modal.</p>}
          {selectedFarmer && (
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold">{selectedFarmer.name}</p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <p className="rounded-md bg-white px-3 py-2 text-sm text-slate-700">Qty: <span className="font-semibold">{totalQuantity}</span></p>
                  <p className="rounded-md bg-white px-3 py-2 text-sm text-emerald-700">Paid: <span className="font-semibold">{formatINR(paidAmount)}</span></p>
                  <p className="rounded-md bg-white px-3 py-2 text-sm text-amber-700">Pending: <span className="font-semibold">{formatINR(pendingAmount)}</span></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(true)}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
                Open Full History
              </button>
            </div>
          )}
        </section>
      </div>

      {historyModalOpen && selectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-0 sm:items-center sm:p-4">
          <div
            className="absolute inset-0"
            onClick={() => setHistoryModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 h-[86vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-xl sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedFarmer.name}</h3>
                <p className="text-xs text-slate-500">{selectedFarmer.village || 'Village not set'}</p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">Qty: <span className="font-semibold">{totalQuantity}</span></p>
                <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Paid: <span className="font-semibold">{formatINR(paidAmount)}</span></p>
                <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">Pending: <span className="font-semibold">{formatINR(pendingAmount)}</span></p>
              </div>

              {selectedFarmerHistory.length === 0 && (
                <p className="text-sm text-slate-600">No purchase history found for this farmer.</p>
              )}

              <div className="space-y-2">
                {selectedFarmerHistory.map((purchase) => (
                  <div key={purchase.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-700">{read(purchase, 'date') || 'N/A'}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-slate-600">
                      <p>Qty: {read(purchase, 'numberOfCoconuts', 'number_of_coconuts') || 0}</p>
                      <p>Amount: {formatINR(read(purchase, 'totalAmount', 'total_amount') || 0)}</p>
                      <p>Status: {read(purchase, 'paymentStatus', 'payment_status') || 'Pending'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
