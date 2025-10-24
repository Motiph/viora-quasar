import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

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

    async login(credentials) {
      console.log('Logging in with', credentials)
      const response = await api.post(`/token/`, credentials)
      console.log(response.data)
      this.token = response.data.access
      this.refreshToken = response.data.refresh
      this.user = response.data.user

      localStorage.setItem('refresh', response.data.refresh)
      localStorage.setItem('token', response.data.access)
      localStorage.setItem('user', JSON.stringify(response.data.user))
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
