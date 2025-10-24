import { defineStore } from 'pinia'
import { api } from '@/boot/api'

export const useCoreStore = defineStore('core', {
  state: () => ({
    token: null, // access token
    refreshToken: null, // refresh token
    user: null, // info opcional del usuario
  }),

  actions: {
    init() {
      this.token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      this.user = userData ? JSON.parse(userData) : null
    },

    async login(email, password) {
      const data = await api.get(`/token/`, {
        method: 'POST',
        body: { email, password },
      })

      this.token = data.access
      this.refreshToken = data.refresh
      this.user = data.user

      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('token', data.access)
      localStorage.setItem('user', JSON.stringify(data.user))
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('refresh')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
