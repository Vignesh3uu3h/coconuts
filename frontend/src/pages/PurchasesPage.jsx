import { useEffect, useState } from 'react'
import api from '../api'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [agents, setAgents] = useState([])
  const [farmers, setFarmers] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    date: '',
    farmerId: '',
    agentId: '',
    numberOfCoconuts: '',
    pricePerCoconut: '',
    paymentStatus: 'Pending',
    notes: '',
  })
  const [newFarmer, setNewFarmer] = useState({ name: '', village: '' })
  const [newAgent, setNewAgent] = useState({ name: '', phone: '', address: '' })

  const fetchData = async () => {
    try {
      const [purchaseRes, agentRes, farmerRes] = await Promise.all([
        api.get('purchases/'),
        api.get('agents/'),
        api.get('farmers/'),
      ])
      setPurchases(purchaseRes.data)
      setAgents(agentRes.data)
      setFarmers(farmerRes.data)
    } catch {
      setPurchases([])
      setAgents([])
      setFarmers([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const preventEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      let farmerId = form.farmerId
      let agentId = form.agentId

      if (form.agentId === 'new') {
        const agentRes = await api.post('agents/', {
          name: newAgent.name,
          phone: newAgent.phone,
          address: newAgent.address,
        })
        agentId = agentRes.data.id
      }

      if (form.farmerId === 'new') {
        const farmerRes = await api.post('farmers/', {
          name: newFarmer.name,
          village: newFarmer.village,
          assignedAgentId: agentId && agentId !== 'new' ? agentId : undefined,
        })
        farmerId = farmerRes.data.id
      }

      const response = await api.post('purchases/', {
        date: form.date,
        farmerId,
        agentId,
        numberOfCoconuts: Number(form.numberOfCoconuts),
        pricePerCoconut: Number(form.pricePerCoconut),
        paymentStatus: form.paymentStatus,
        notes: form.notes,
      })
      setMessage('Purchase recorded successfully.')
      setError('')
      setForm({ date: '', farmerId: '', agentId: '', numberOfCoconuts: '', pricePerCoconut: '', paymentStatus: 'Pending', notes: '' })
      setNewFarmer({ name: '', village: '' })
      setNewAgent({ name: '', phone: '', address: '' })
      await fetchData()
      setPurchases((prev) => [response.data, ...prev])
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save purchase.')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Buy Coconut from Farmer</h1>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Purchase Entry</h2>
          <p className="mb-4 text-sm text-slate-600">Record buying coconuts from farmers through your agents. This will update warehouse stock and the farmer supply cycle.</p>
          {message && <div className="mb-4 rounded bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          {error && <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Farmer</span>
              <select
                value={form.farmerId}
                onChange={(e) => setForm({ ...form, farmerId: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                required
              >
                <option value="">Select farmer</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>{farmer.name} ({farmer.village})</option>
                ))}
                <option value="new">Create new farmer</option>
              </select>
            </label>
            {form.farmerId === 'new' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold mb-3">New Farmer Details</h3>
                <label className="block mb-3">
                  <span className="text-sm font-medium text-slate-700">Farmer Name</span>
                  <input
                    type="text"
                    value={newFarmer.name}
                    onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                    required
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-sm font-medium text-slate-700">Village</span>
                  <input
                    type="text"
                    value={newFarmer.village}
                    onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                  />
                </label>
              </div>
            )}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Agent</span>
              <select
                value={form.agentId}
                onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                required
              >
                <option value="">Select agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
                <option value="new">Create new agent</option>
              </select>
            </label>
            {form.agentId === 'new' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold mb-3">New Agent Details</h3>
                <label className="block mb-3">
                  <span className="text-sm font-medium text-slate-700">Agent Name</span>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                    required
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input
                    type="text"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Address</span>
                  <input
                    type="text"
                    value={newAgent.address}
                    onChange={(e) => setNewAgent({ ...newAgent, address: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                  />
                </label>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Coconuts Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={form.numberOfCoconuts}
                  onChange={(e) => setForm({ ...form, numberOfCoconuts: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Price per Coconut</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.pricePerCoconut}
                  onChange={(e) => setForm({ ...form, pricePerCoconut: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 p-2"
                  required
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Payment Status</span>
              <select
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                rows="3"
              />
            </label>
            <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">Save Purchase</button>
          </form>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Store Purchases</h2>
          <div className="space-y-4">
            {purchases.length === 0 && <p className="text-sm text-slate-600">No purchase records yet.</p>}
            {purchases.map((purchase) => (
              <div key={purchase.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{purchase.farmer_name}</h3>
                  <span className="text-xs text-slate-500">{purchase.date}</span>
                </div>
                <p className="text-sm text-slate-600">Agent: {purchase.agent_name}</p>
                <p className="text-sm text-slate-600">Qty: {purchase.number_of_coconuts}</p>
                <p className="text-sm text-slate-600">Total: {purchase.total_amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
