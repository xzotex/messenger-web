import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  user_id: string
  login: string
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userId = ref<string | null>(null)
  const login = ref<string | null>(null)

  if (token.value) {
    try {
      const payload = jwtDecode<JwtPayload>(token.value)
      userId.value = payload.user_id
      login.value = payload.login
    } catch {
      token.value = null
      localStorage.removeItem('token')
    }
  }

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('token', t)
    const payload = jwtDecode<JwtPayload>(t)
    userId.value = payload.user_id
    login.value = payload.login
  }

  function logout() {
    token.value = null
    userId.value = null
    login.value = null
    localStorage.removeItem('token')
  }

  return { token, userId, login, setToken, logout }
})
