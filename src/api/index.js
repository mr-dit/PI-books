import axios from 'axios'
const apiUrl = import.meta.env.VITE_BACKEND_API_URL

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Отправка и получение cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
