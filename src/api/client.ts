import axios from 'axios'

const apiHost = (import.meta.env.VITE_API_URL || 'https://test.bachelorproject26.site').replace(/\/$/, '')

const api = axios.create({
  baseURL: `${apiHost}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
