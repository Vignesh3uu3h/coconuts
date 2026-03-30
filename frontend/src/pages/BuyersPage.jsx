import { useEffect, useState } from 'react'
import api from '../api'

export default function BuyersPage() {
  const [buyers, setBuyers] = useState([])

  useEffect(() => {
    api.get('buyers/').then((res) => setBuyers(res.data)).catch(() => setBuyers([]))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Buyers</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {buyers.map((buyer) => (
          <div key={buyer.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{buyer.business_name}</h2>
            <p className="text-sm text-slate-600">{buyer.phone}</p>
            <p className="text-sm text-slate-600">Location: {buyer.location}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
