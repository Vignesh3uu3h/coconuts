import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'admin', phone: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const preventEnterKey = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('auth/register/', form)
      setMessage('Registration successful. Please login.')
      setError('')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to register user.')
      setMessage('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Register a new account</h1>
        {message && <div className="mb-4 rounded bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onKeyDown={preventEnterKey}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              type="text"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={preventEnterKey}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              type="email"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              onKeyDown={preventEnterKey}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              type="text"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={preventEnterKey}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              type="password"
              required
            />
          </label>
          <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}
