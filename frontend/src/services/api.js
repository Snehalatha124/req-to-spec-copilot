import axios from 'axios'

const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
}

export const specAPI = {
  generate: (requirementText) => 
    api.post('/generate/spec', { requirement_text: requirementText }),
  refine: (requirementText, refinementInstructions, previousSpec) =>
    api.post('/generate/refine/spec', {
      requirement_text: requirementText,
      refinement_instructions: refinementInstructions,
      previous_spec: previousSpec,
    }),
  getHistory: (limit = 10) =>
    api.get(`/generate/history?limit=${limit}`),
}

export default api

