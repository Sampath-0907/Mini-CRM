import axios from 'axios'

const api = axios.create({
  baseURL: '', // Using proxy defined in vite.config.js
})

// Add a request interceptor to add the x-auth-token header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-auth-token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api
