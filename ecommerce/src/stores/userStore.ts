import { defineStore } from 'pinia';
import axios from 'axios';

// Ajustamos la URL base de Axios para que apunte a tu backend
axios.defaults.baseURL = 'http://localhost:5162';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as any,
    error: null as string | null,
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        // Ahora la petición irá a: http://localhost:5162/api/Usuario/login
        const response = await axios.post('/api/Usuario/login', credentials);
        this.user = response.data;
        this.error = null;
      } catch (error: any) {
        this.error = error.response ? error.response.data : 'Error de conexión';
        this.user = null;
      }
    },
    logout() {
      this.user = null;
      this.error = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
