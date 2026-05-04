import axios from 'axios'

const envApiUrl = import.meta.env.VITE_API_URL
const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:'
// If the page is HTTPS and env URL is HTTP, use the Netlify /api proxy to avoid mixed content.
const baseUrl = envApiUrl
  ? (isHttpsPage && envApiUrl.startsWith('http://') ? '/api' : `${envApiUrl}/api`)
  : '/api'

const api = axios.create({
  baseURL: baseUrl
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('fl_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

// Plants
export const getPlants = () => api.get('/plants')
export const getPlant = (id) => api.get(`/plants/${id}`)
export const createPlant = (data) => api.post('/plants', data)
export const deletePlant = (id) => api.delete(`/plants/${id}`)

// Plant types
export const getPlantTypes = () => api.get('/plant-types')
export const lookupPlantType = (name) => api.get(`/plant-types/lookup?name=${encodeURIComponent(name)}`)

// Sensor readings
export const getReadings = (plantId, limit = 50) =>
  api.get(`/sensor-data/${plantId}/readings?limit=${limit}`)

// Watering
export const triggerWatering = (data) => api.post('/watering', data)
export const getWateringHistory = (plantId) => api.get(`/watering/${plantId}`)

// Alerts
export const getAlerts = () => api.get('/alerts')
export const markAlertRead = (id) => api.patch(`/alerts/${id}/read`)

// Diary
export const getDiaryEntries = (plantId) => api.get(`/diary/${plantId}`)
export const addDiaryEntry = (data) => api.post('/diary', data)
export const deleteDiaryEntry = (id) => api.delete(`/diary/${id}`)

export default api
