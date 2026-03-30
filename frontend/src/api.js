import axios from 'axios'

const api = axios.create({
  baseURL: 'https://coconut-api-04l7.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getAccessToken = () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token || token === 'undefined' || token === 'null') return ''
    return token
  } catch {
    return ''
  }
}

export const setAuthTokens = ({ access, token, refresh }) => {
  const accessToken = access || token
  if (!accessToken) return false
  try {
    localStorage.setItem('access_token', accessToken)
    if (refresh) {
      localStorage.setItem('refresh_token', refresh)
    } else {
      localStorage.removeItem('refresh_token')
    }
  } catch {
    return false
  }
  return true
}

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export default api
