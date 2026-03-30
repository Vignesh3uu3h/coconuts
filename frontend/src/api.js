import axios from 'axios'

const api = axios.create({
  baseURL: 'https://coconut-api-04l7.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

const STORAGE_KEYS = {
  access: 'access_token',
  refresh: 'refresh_token',
}

const safeStorage = {
  get(key) {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore storage failures
    }
  },
}

const parseJwt = (token) => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export const clearAuthTokens = () => {
  safeStorage.remove(STORAGE_KEYS.access)
  safeStorage.remove(STORAGE_KEYS.refresh)
}

export const getAccessToken = () => {
  const token = safeStorage.get(STORAGE_KEYS.access)
  if (!token || token === 'undefined' || token === 'null') {
    return ''
  }

  const payload = parseJwt(token)
  if (payload?.exp && Date.now() >= payload.exp * 1000) {
    clearAuthTokens()
    return ''
  }

  return token
}

export const isAuthenticated = () => !!getAccessToken()

export const setAuthTokens = ({ access, token, refresh }) => {
  const accessToken = access || token
  if (!accessToken) return false

  const savedAccess = safeStorage.set(STORAGE_KEYS.access, accessToken)
  if (!savedAccess) return false

  if (refresh) {
    safeStorage.set(STORAGE_KEYS.refresh, refresh)
  } else {
    safeStorage.remove(STORAGE_KEYS.refresh)
  }

  return true
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const requestUrl = String(error?.config?.url || '')
    const isLoginRequest = requestUrl.includes('auth/login')

    if (status === 401 && !isLoginRequest) {
      clearAuthTokens()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default api
