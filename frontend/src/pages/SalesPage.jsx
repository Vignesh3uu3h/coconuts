import { useEffect, useState } from 'react'
import api from '../api'

export default function SalesPage() {
  const [sales, setSales] = useState([])
  const [buyers, setBuyers] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    buyerId: '',
    date: '',
    coconutsSold: '',
    pricePerCoconut: '',
    paymentStatus: 'Pending',
    transportNotes: '',
  })
  const [newBuyer, setNewBuyer] = useState({ business_name: '', phone: '', location: '' })

  const fetchData = async () => {
    try {
      const [salesRes, buyersRes] = await Promise.all([api.get('sales/'), api.get('buyers/')])
      setSales(salesRes.data)
      setBuyers(buyersRes.data)
    } catch {
      setSales([])
      setBuyers([])
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
      let buyerId = form.buyerId

      if (form.buyerId === 'new') {
        const buyerRes = await api.post('buyers/', {
          business_name: newBuyer.business_name,
          phone: newBuyer.phone,
          location: newBuyer.location,
        })
        buyerId = buyerRes.data.id
      }

      const response = await api.post('sales/', {
        buyerId,
        date: form.date,
        coconutsSold: Number(form.coconutsSold),
        pricePerCoconut: Number(form.pricePerCoconut),
        paymentStatus: form.paymentStatus,
        transportNotes: form.transportNotes,
      })
      setMessage('Sale recorded successfully.')
      setError('')
      setForm({ buyerId: '', date: '', coconutsSold: '', pricePerCoconut: '', paymentStatus: 'Pending', transportNotes: '' })
      setNewBuyer({ business_name: '', phone: '', location: '' })
      await fetchData()
      setSales((prev) => [response.data, ...prev])
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save sale.')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Sell Coconut to Buyer</h1>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Sales Entry</h2>
          <p className="mb-4 text-sm text-slate-600">Record wholesale coconut sales and reduce warehouse stock immediately to keep inventory accurate.</p>
          {message && <div className="mb-4 rounded bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          {error && <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Buyer</span>
              <select
                value={form.buyerId}
                onChange={(e) => setForm({ ...form, buyerId: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                required
              >
                <option value="">Select buyer</option>
                {buyers.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>{buyer.business_name}</option>
                ))}
                <option value="new">Create new buyer</option>
              </select>
            </label>
            {form.buyerId === 'new' && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold mb-3">New Buyer Details</h3>
                <label className="block mb-3">
                  <span className="text-sm font-medium text-slate-700">Business Name</span>
                  <input
                    type="text"
                    value={newBuyer.business_name}
                    onChange={(e) => setNewBuyer({ ...newBuyer, business_name: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                    required
                  />
                </label>
                <label className="block mb-3">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input
                    type="text"
                    value={newBuyer.phone}
                    onChange={(e) => setNewBuyer({ ...newBuyer, phone: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Location</span>
                  <input
                    type="text"
                    value={newBuyer.location}
                    onChange={(e) => setNewBuyer({ ...newBuyer, location: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 p-2"
                  />
                </label>
              </div>
            )}
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
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Coconuts Sold</span>
                <input
                  type="number"
                  min="1"
                  value={form.coconutsSold}
                  onChange={(e) => setForm({ ...form, coconutsSold: e.target.value })}
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
              <span className="text-sm font-medium text-slate-700">Transport Notes</span>
              <textarea
                value={form.transportNotes}
                onChange={(e) => setForm({ ...form, transportNotes: e.target.value })}
                onKeyDown={preventEnterKey}
                className="mt-1 w-full rounded border border-slate-300 p-2"
                rows="3"
              />
            </label>
            <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">Save Sale</button>
          </form>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {sales.length === 0 && <p className="text-sm text-slate-600">No sale records yet.</p>}
            {sales.map((sale) => (
              <div key={sale.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{sale.buyer_name}</h3>
                  <span className="text-xs text-slate-500">{sale.date}</span>
                </div>
                <p className="text-sm text-slate-600">Qty: {sale.coconuts_sold}</p>
                <p className="text-sm text-slate-600">Total: {sale.total_amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
