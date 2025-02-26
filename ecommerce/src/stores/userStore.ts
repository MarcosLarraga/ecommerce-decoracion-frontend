import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCartStore } from '@/stores/cartStore';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
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

    /// 🔹 **Obtener datos del usuario autenticado**
    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No hay token disponible.');
          return;
        }

        // Decodificar el token para obtener el ID del usuario
        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) {
          console.error('No se pudo obtener el ID del usuario desde el token.');
          return;
        }

        const userId = decoded.sub;

        const response = await axios.get(`http://localhost:5162/api/usuario/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
      }
    },

    /// 🔹 **Modificar solo el teléfono y la dirección del usuario autenticado**
async updateUserPhoneAndAddress(telefono: string, direccion: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible.');
      return;
    }

    // Decodificar el token para obtener el ID del usuario
    const decoded: any = this.decodeToken(token);
    if (!decoded?.sub) {
      console.error('No se pudo obtener el ID del usuario desde el token.');
      return;
    }

    const userId = decoded.sub;

    await axios.put(`http://localhost:5162/api/usuario/${userId}`, {
      telefono,
      direccion
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // Actualizar solo el teléfono y la dirección en el store
    if (this.user) {
      this.user.telefono = telefono;
      this.user.direccion = direccion;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
    
    console.log('✅ Teléfono y dirección actualizados correctamente.');
  } catch (error) {
    console.error('❌ Error actualizando teléfono y dirección:', error);
  }
},

    /// 🔹 **Login del usuario**
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
          localStorage.setItem('user', JSON.stringify(this.user));

          // Cargar datos completos del usuario después del login
          await this.fetchUserData();
        }
      } catch (err: any) {
        console.error('Error en login:', err);
        this.error = err.response?.data || 'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    },

    /// 🔹 **Registro de usuario**
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

    /// 🔹 **Login con Google**
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
          localStorage.setItem('user', JSON.stringify(this.user));

          // Cargar datos completos del usuario después del login
          await this.fetchUserData();
        }
      } catch (err: any) {
        console.error('Error en googleLogin:', err);
        this.error = err.response?.data || 'Error al iniciar sesión con Google';
      } finally {
        this.loading = false;
      }
    },

    /// 🔹 **Cerrar sesión**
    logout() {
      console.log('Haciendo logout.');
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 🛒 Limpiar carrito al cerrar sesión
      const cartStore = useCartStore();
      cartStore.clearCart();
    },

    /// 🔹 **Inicializar usuario al cargar la página**
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

          // Cargar datos completos del usuario al iniciar
          this.fetchUserData();
        } else {
          this.logout();
        }
      } else {
        console.log('No hay token en localStorage.');
      }
    }
  }
});
