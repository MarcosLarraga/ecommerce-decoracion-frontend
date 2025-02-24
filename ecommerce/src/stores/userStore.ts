import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import nombrado

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null as any,
    loading: false,
    error: ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    decodeToken(token: string) {
      try {
        return jwtDecode(token);
      } catch (err) {
        console.warn('Error decodificando el token:', err);
        return null;
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        console.log('Enviando login con', { email, password });
        const response = await axios.post('http://localhost:5162/api/auth/login', { email, password });
        console.log('LOGIN response data:', response.data);
        
        const { token } = response.data;
        if (!token) {
          this.error = 'La API no devolvió un token.';
          return;
        }
        this.token = token;
        localStorage.setItem('token', token);

        const decoded: any = this.decodeToken(token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role
          };
          console.log('Usuario asignado:', this.user);
        }
      } catch (err: any) {
        console.error('Error en login:', err);
        this.error = err.response?.data || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    },

    async register(nombre: string, email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        console.log('Enviando register con', { nombre, email, password });
        const response = await axios.post('http://localhost:5162/api/auth/register', { nombre, email, password });
        console.log('REGISTER response data:', response.data);
      } catch (err: any) {
        console.error('Error en register:', err);
        this.error = err.response?.data || 'Error en el registro';
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      this.error = '';
      try {
        console.log('Enviando forgotPassword con', { email });
        const response = await axios.post('http://localhost:5162/api/auth/forgot-password', { email });
        console.log('FORGOT PASSWORD response:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error en forgotPassword:', err);
        this.error = err.response?.data || 'Error al enviar correo de reseteo';
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true;
      this.error = '';
      try {
        console.log('Enviando resetPassword con', { token, newPassword });
        const response = await axios.post('http://localhost:5162/api/auth/reset-password', { token, newPassword });
        console.log('RESET PASSWORD response:', response.data);
        return response.data;
      } catch (err: any) {
        console.error('Error en resetPassword:', err);
        this.error = err.response?.data || 'Error al restablecer la contraseña';
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async googleLogin(idToken: string) {
      this.loading = true;
      this.error = '';
      try {
        console.log('Enviando googleLogin con', { idToken });
        const response = await axios.post('http://localhost:5162/api/auth/google-login', { idToken });
        console.log('GOOGLE LOGIN response data:', response.data);

        const { token } = response.data;
        if (!token) {
          this.error = 'La API no devolvió token en googleLogin.';
          return;
        }
        this.token = token;
        localStorage.setItem('token', token);

        const decoded: any = this.decodeToken(token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role
          };
        }
      } catch (err: any) {
        console.error('Error en googleLogin:', err);
        this.error = err.response?.data || 'Error al iniciar sesión con Google';
      } finally {
        this.loading = false;
      }
    },

    logout() {
      console.log('Haciendo logout.');
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
    },

    initialize() {
      if (this.token) {
        console.log('Inicializando store con token:', this.token);
        const decoded: any = this.decodeToken(this.token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role
          };
          console.log('Store inicializado, usuario:', this.user);
        } else {
          this.logout();
        }
      } else {
        console.log('No hay token en localStorage.');
      }
    }
  }
});
