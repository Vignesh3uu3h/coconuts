import { useEffect, useState } from 'react'
import api from '../api'

export default function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const preventEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const fetchAgents = async () => {
    try {
      const res = await api.get('agents/')
      setAgents(res.data)
    } catch {
      setAgents([])
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
      }
      await api.post('agents/', payload)
      setMessage('Agent created successfully.')
      setForm({ name: '', phone: '', address: '' })
      fetchAgents()
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to create agent.')
    }
  }

  return (
    <div>
      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold mb-2">Buying Agents</h1>
          <p className="text-slate-600">Manage your buying agents who collect coconuts from farmers and deliver them to your warehouse.</p>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Create Agent</h2>
          {message && <div className="mb-4 rounded bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div>}
          {error && <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Phone</span>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Address</span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
              />
            </label>
            <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">Add Agent</button>
          </form>
        </section>
      </div>
      <div className="space-y-4">
        {agents.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-yellow-50 p-4 text-slate-700">
            No agents found yet. Add agent records in the backend or create one using the form.
          </div>
        )}
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <p className="text-sm text-slate-600">Phone: {agent.phone}</p>
            </div>
            <p className="mt-2 text-sm text-slate-600">Address: {agent.address || 'No address provided'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
