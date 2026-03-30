import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { setAuthTokens } from '../api'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post('auth/login/', form)
      setAuthTokens(response.data)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials or server error.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Login to Coconut Management</h1>
        <p className="mb-4 text-sm text-slate-500">If you do not have an account, please register first.</p>
        {error && <div className="mb-4 rounded bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              type="text"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded border border-slate-300 p-2"
              type="password"
              required
            />
          </label>
          <button className="w-full rounded bg-slate-900 px-4 py-2 text-white" type="submit">Login</button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-600">
          <Link to="/register" className="text-slate-900 font-semibold">Create an account</Link>
        </div>
      </div>
    </div>
  )
}
