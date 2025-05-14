// stores/authStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  nombre: string;
  email: string;
  esAdmin: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token && !!this.user;
    },
    isAdmin(): boolean {
      return this.isAuthenticated && !!this.user?.esAdmin;
    },
    userName(): string {
      return this.user?.nombre || '';
    }
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/api/Auth/login', credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión';
        console.error('Error en login:', this.error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserProfile() {
      if (!this.token) return;
      
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/Usuario/profile', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.user = response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al obtener el perfil';
        console.error('Error al obtener perfil:', this.error);
        // Si hay un error de autenticación, cerrar sesión
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },

    // Inicializa el estado de autenticación al cargar la aplicación
    async initialize() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        await this.fetchUserProfile();
      }
    }
  }
});