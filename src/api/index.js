import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const apiUrl = import.meta.env.VITE_BACKEND_API_URL

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Отправка и получение cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response, // Если ответ успешен, просто возвращаем его
  (error) => {
    console.log(error)

    const authStore = useAuthStore()
    if (error.status === 401) {
      console.log('Ошибка авторизации, пользователь не авторизован.')
      authStore.setAuthenticated(false)
    }

    return Promise.reject(error) // Пробрасываем ошибку дальше
  }
)

export default api
