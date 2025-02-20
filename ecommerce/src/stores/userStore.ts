import { defineStore } from 'pinia';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5162';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as any,
    error: null as string | null,
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      console.log('Login iniciado con:', credentials);
      try {
        const response = await axios.post('/api/Usuario/login', credentials);
        console.log('Respuesta de login:', response.data);
        this.user = response.data;
        this.error = null;
      } catch (error: any) {
        console.error('Error en login:', error.response ? error.response.data : 'Error de conexión');
        this.error = error.response ? error.response.data : 'Error de conexión';
        this.user = null;
      }
    },
    async register(userData: { nombre: string; email: string; password: string }) {
      console.log('Registro iniciado con:', userData);
      try {
        const payload = {
          Nombre: userData.nombre,
          Email: userData.email,
          Password: userData.password,
        };
        const response = await axios.post('/api/Usuario/register', payload);
        console.log('Respuesta de registro:', response.data);
        // No asignamos this.user para que no se inicie sesión automáticamente.
        this.error = null;
      } catch (error: any) {
        console.error('Error en registro:', error.response ? error.response.data : 'Error de conexión');
        this.error = error.response ? error.response.data : 'Error de conexión';
        this.user = null;
      }
    },
    logout() {
      console.log('Cerrando sesión para:', this.user);
      this.user = null;
      this.error = null;
      console.log('Sesión cerrada.');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  persist: true,
});
