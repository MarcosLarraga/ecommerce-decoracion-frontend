// userStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

// Base URL ya configurada para apuntar a tu backend.
axios.defaults.baseURL = 'http://localhost:5162';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as any,
    error: null as string | null,
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const response = await axios.post('/api/Usuario/login', credentials);
        this.user = response.data;
        this.error = null;
      } catch (error: any) {
        this.error = error.response ? error.response.data : 'Error de conexión';
        this.user = null;
      }
    },
    async register(userData: { nombre: string; email: string; password: string }) {
      try {
        const payload = {
          Nombre: userData.nombre,
          Email: userData.email,
          Password: userData.password,  // Se envía la contraseña en claro
        };
        const response = await axios.post('/api/Usuario/register', payload);
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
