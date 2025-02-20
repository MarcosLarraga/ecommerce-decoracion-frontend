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
        if (error.response) {
          switch (error.response.status) {
            case 400:
              // Error 400: Datos inválidos (por ejemplo, email no válido, campos faltantes)
              this.error = error.response.data;
              break;
            case 409:
              // Error 409: Conflicto (por ejemplo, el usuario ya existe con ese correo)
              this.error = error.response.data;
              break;
            default:
              // Otros errores, por ejemplo, 500 (Error inesperado en el servidor)
              this.error = error.response.data || 'Error inesperado en el servidor.';
              break;
          }
        } else {
          this.error = 'Error de conexión';
        }
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
