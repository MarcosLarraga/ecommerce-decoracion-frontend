// src/stores/userStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Estado
  const token = ref<string | null>(null)
  const userData = ref<any>(null)

  // Indica si el usuario está logueado
  const isLoggedIn = computed(() => !!token.value)

  // Getter para rol (devuelve, por ejemplo, 'admin' o 'user')
  const role = computed(() => userData.value?.role || 'guest')

  /**
   * Acción para iniciar sesión
   * Supone que tu backend responde con algo así:
   * {
   *   token: "abc123",
   *   user: {
   *     role: "admin",
   *     ...
   *   }
   * }
   */
  async function login(email: string, password: string) {
    try {
      const response = await axios.post('/api/login', { email, password })
      token.value = response.data.token
      userData.value = response.data.user

      // Guardar token en localStorage para persistir la sesión
      localStorage.setItem('token', response.data.token)
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      throw error
    }
  }

  /**
   * Restaura la sesión (por si hay un token en localStorage)
   * Puedes hacer otra llamada para obtener userData si lo necesitas
   */
  function restoreSession() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // Opcionalmente, recargar userData desde el backend
      // ...
    }
  }

  /**
   * Cierra la sesión
   */
  function logout() {
    token.value = null
    userData.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userData,
    isLoggedIn,
    role,
    login,
    restoreSession,
    logout
  }
})
