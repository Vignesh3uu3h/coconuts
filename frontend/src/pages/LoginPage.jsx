import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api, { setAuthTokens } from '../api'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('auth/login/', form)
      const saved = setAuthTokens(response.data || {})
      if (!saved) {
        setError('Login response missing token. Please try again.')
        setLoading(false)
        return
      }
      setLoading(false)
      navigate('/', { replace: true })
      window.location.replace('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials or server error.')
      setLoading(false)
    }
  }

  return (
    <div className="login-screen flex min-h-screen items-center justify-center px-4">
      <div className="login-glow" aria-hidden="true" />
      <div className="login-card w-full max-w-md rounded-2xl border border-emerald-200/70 bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="mb-2 text-2xl font-bold text-emerald-900">தேங்காய் வாடி உள்நுழைவு</h1>
        <p className="mb-4 text-sm text-slate-600">If you do not have an account, please register first.</p>

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
          <button
            className="w-full rounded bg-emerald-900 px-4 py-2 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          <Link to="/register" className="font-semibold text-emerald-900">Create an account</Link>
        </div>
      </div>
    </div>
  )
}
