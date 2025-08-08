import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})


const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.method === 'get') {
      const cacheKey = `${config.url}${config.params ? JSON.stringify(config.params) : ''}`
      const cached = cache.get(cacheKey)

      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        config.metadata = { fromCache: true, cacheKey }
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get' && !response.config.metadata?.fromCache) {
      const cacheKey = `${response.config.url}${response.config.params ? JSON.stringify(response.config.params) : ''}`
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })
    }

    return response
  },
  (error) => Promise.reject(error)
)

export const getJWTToken = async (email) => {
  const response = await api.post('/auth/jwt', { email })
  const token = response.data.token
  localStorage.setItem('accessToken', token)
  return token
}

export const clearToken = () => {
  localStorage.removeItem('accessToken')
}


export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})


publicApi.interceptors.response.use(
  (response) => {
    if (response.config.method === 'get') {
      const cacheKey = `public_${response.config.url}${response.config.params ? JSON.stringify(response.config.params) : ''}`
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      })
    }

    return response
  },
  (error) => Promise.reject(error)
)

export default api
