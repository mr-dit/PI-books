import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useLoaderStore } from '@/stores/loader'

const api = axios.create({
  baseURL: '/books-api/',
  withCredentials: true, // Отправка и получение cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

// Добавляем перехватчик запросов
api.interceptors.request.use(
  (config) => {
    const loaderStore = useLoaderStore()
    loaderStore.showLoader()
    return config
  },
  (error) => {
    const loaderStore = useLoaderStore()
    loaderStore.hideLoader()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    const loaderStore = useLoaderStore()
    loaderStore.hideLoader()
    return response
  },
  (error) => {
    console.log(error)
    const loaderStore = useLoaderStore()
    loaderStore.hideLoader()

    const authStore = useAuthStore()
    if (error.status === 401) {
      console.log('Ошибка авторизации, пользователь не авторизован.')
      authStore.setAuthenticated(false)
    }

    return Promise.reject(error)
  }
)

export default api
