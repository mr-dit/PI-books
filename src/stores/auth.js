import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false
  }),
  actions: {
    setAuthenticated(status) {
      this.isAuthenticated = status
      localStorage.setItem('isAuthenticated', status)
    }
  }
})
