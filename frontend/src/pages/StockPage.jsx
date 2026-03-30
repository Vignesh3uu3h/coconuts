import { useEffect, useState } from 'react'
import api from '../api'

export default function StockPage() {
  const [stock, setStock] = useState(null)

  useEffect(() => {
    api.get('stock/current/').then((res) => setStock(res.data)).catch(() => setStock(null))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Stock</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {['total_stock', 'total_in', 'total_out'].map((key) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">{key.replace('_', ' ')}</p>
            <p className="mt-4 text-3xl font-semibold">{stock ? stock[key] : '...'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
