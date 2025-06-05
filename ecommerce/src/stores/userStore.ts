import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useCartStore } from '../stores/cartStore';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: '',
    isGoogleUser: localStorage.getItem('isGoogleUser') === 'true',
    // Nuevo: Añadir flags para depuración
    lastLoginAttempt: null as any,
    debugInfo: {} as any
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,

    // Getter mejorado para detectar administradores
    isAdmin: (state) => {
      // Almacenar en depuración para ver qué valor tiene state.user
      if (typeof state.debugInfo === 'object') {
        state.debugInfo.userForIsAdmin = { ...state.user };
      }

      // Si no hay usuario, no es admin
      if (!state.user) return false;

      // Verificar todos los posibles formatos de rol de administrador
      const isAdminRole =
        state.user.role === 'Admin' ||
        state.user.role === 'admin' ||
        (state.user.roles && (state.user.roles.includes('Admin') || state.user.roles.includes('admin')));

      const hasAdminFlag =
        state.user.esAdmin === true ||
        state.user.isAdmin === true;

      // Almacenar resultados parciales para depuración
      if (typeof state.debugInfo === 'object') {
        state.debugInfo.isAdminChecks = {
          isAdminRole,
          hasAdminFlag,
          role: state.user.role,
          roles: state.user.roles,
          esAdmin: state.user.esAdmin,
          isAdmin: state.user.isAdmin
        };
      }

      return isAdminRole || hasAdminFlag;
    },

    displayName: (state) => state.user?.nombre || state.user?.email || 'Invitado'
  },

  actions: {
    // Nuevo: método específico para depuración
    getDebugInfo() {
      return {
        ...this.debugInfo,
        isAuthenticated: this.isAuthenticated,
        isAdmin: this.isAdmin,
        user: this.user,
        token: this.token ? 'Presente (no mostrado por seguridad)' : 'No presente'
      };
    },

    decodeToken(token: string) {
      try {
        return jwtDecode(token);
      } catch (err) {
        console.warn('Error decodificando el token:', err);
        return null;
      }
    },

    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) return;

        const userId = decoded.sub;
        console.log("Obteniendo datos para el usuario ID:", userId);

        // Configurar headers de autorización
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const response = await axios.get(`/api/usuario/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Respuesta completa de fetchUserData:", response);

        // Asignamos todo el objeto recibido a this.user
        this.user = response.data;

        // IMPORTANTE: Mantener el rol del token si no viene en los datos del usuario
        if (!this.user.role && decoded.role) {
          this.user.role = decoded.role;
        }

        // Mostramos en consola toda la información
        console.log("Información completa del usuario:", this.user);
        console.log("¿Es administrador después de fetchUserData?", this.isAdmin);

        // Guardamos en localStorage la información completa
        localStorage.setItem('user', JSON.stringify(this.user));

        return this.user;
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);

        // Si es un error de autorización, cerrar sesión
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
          console.warn("Error de autorización al obtener datos. Cerrando sesión.");
          this.logout();
        } else {
          toast.error("Error al obtener los datos del usuario.");
        }

        return null;
      }
    },

    async register(nombre: string, email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        // Llamamos a la API de registro
        const response = await axios.post('/api/auth/register', {
          nombre,
          email,
          password
        });

        // Si el registro fue exitoso, podemos mostrar un mensaje
        toast.success("Registro exitoso. ¡Ya puedes iniciar sesión!");

        // Retornamos true o algo para indicar éxito
        return true;
      } catch (err) {
        console.error('Error en register:', err);
        this.error = 'Error al registrar usuario';
        toast.error("Error al registrar usuario.");
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Nuevo: método para registrar administradores
    async registerAdmin(nombre: string, email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        // Intentar usar un endpoint específico para admins si existe
        let endpoint = '/api/auth/register-admin';

        try {
          const response = await axios.post(endpoint, {
            nombre,
            email,
            password,
            role: 'Admin' // Explícitamente indicamos que es admin
          });

          toast.success("Administrador registrado exitosamente.");
          return true;
        } catch (adminErr) {
          console.warn("No se pudo usar el endpoint de registro de admin. Intentando registro normal con rol admin...");

          // Si falla, intentar con el endpoint normal pero especificando rol admin
          const response = await axios.post('/api/auth/register', {
            nombre,
            email,
            password,
            role: 'Admin',
            esAdmin: true
          });

          toast.success("Administrador registrado exitosamente.");
          return true;
        }
      } catch (err) {
        console.error('Error en registerAdmin:', err);
        this.error = 'Error al registrar administrador';
        toast.error("Error al registrar administrador.");
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Método mejorado para forgotPassword en userStore.ts
    async forgotPassword(email: string) {
      this.loading = true;
      this.error = '';

      try {
        console.log(`Enviando solicitud de reset para: ${email}`);

        // Validar email antes de enviar
        const emailPattern = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
          throw new Error('Email inválido');
        }

        const response = await axios.post('/api/auth/forgot-password',
          { email },
          {
            timeout: 30000, // 30 segundos de timeout
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Respuesta de forgot-password:', response.data);

        toast.success("Si el email existe, recibirás instrucciones para restablecer tu contraseña.");

        return true;
      } catch (err: any) {
        console.error('Error en forgotPassword:', err);

        let errorMessage = 'Error al enviar el email de recuperación.';

        if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
          errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
        } else if (err.response) {
          // Error del servidor
          switch (err.response.status) {
            case 400:
              errorMessage = err.response.data?.message || 'Datos inválidos.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
              break;
            case 503:
              errorMessage = 'Servicio temporalmente no disponible.';
              break;
            default:
              errorMessage = `Error del servidor (${err.response.status}).`;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.error = errorMessage;
        toast.error(errorMessage);

        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    async updateUserProfile(datos: { nombre: string, telefono: string, direccion: string }) {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) return;
        const userId = decoded.sub;
        await axios.put(`/api/usuario/${userId}`, datos, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (this.user) {
          this.user = { ...this.user, ...datos };
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        toast.success("Perfil actualizado correctamente.");
      } catch (error) {
        console.error('Error actualizando perfil:', error);
        toast.error("Error al actualizar el perfil.");
      }
    },

    // Corrección para el método updateUserPhoneAndAddress en userStore.ts

    async updateUserPhoneAndAddress(telefono: string, direccion: string) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("No se encontró token de autenticación.");
          return;
        }

        // Decodificar el token para obtener el ID del usuario
        const decoded: any = this.decodeToken(token);
        if (!decoded?.sub) {
          toast.error("No se pudo identificar al usuario.");
          return;
        }

        const userId = decoded.sub;

        // Configurar encabezados de autorización
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        };

        // Crear el objeto con los datos a actualizar
        const userData = {
          telefono,
          direccion
        };

        console.log(`Actualizando datos de usuario ${userId}:`, userData);

        // Realizar la solicitud PUT
        const response = await axios.put(
          `/api/Usuario/${userId}`,
          userData,
          { headers }
        );

        console.log("Respuesta de actualización:", response.data);

        // Actualizar el estado del usuario
        if (this.user) {
          this.user.telefono = telefono;
          this.user.direccion = direccion;
          localStorage.setItem('user', JSON.stringify(this.user));

        }

        return true;
      } catch (error: any) {
        console.error('Error actualizando teléfono y dirección:', error);

        // Mensaje de error detallado
        const errorMessage = error.response?.data?.message ||
          error.response?.data ||
          "Error al actualizar teléfono y dirección.";

        toast.error(errorMessage);

        // Registrar información adicional para diagnóstico
        console.error("Detalles del error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });

        throw error;
      }
    },

    // Actualizamos este método para llamar al endpoint reset-password
    async changePassword(nuevaContraseña: string) {
      try {
        // No se requiere enviar la contraseña actual para este endpoint
        await axios.post('/api/Auth/reset-password', {
          newPassword: nuevaContraseña
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        toast.success("Contraseña restablecida correctamente.");
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        toast.error("No se pudo restablecer la contraseña.");
      }
    },

    // Método de login mejorado con mejor soporte para administradores
    async login(email: string, password: string) {
      this.loading = true;
      this.error = '';

      // Almacenar información del intento para depuración
      this.lastLoginAttempt = { email, timestamp: new Date().toISOString() };

      try {
        console.log(`Intentando iniciar sesión con email: ${email}`);
        const response = await axios.post('/api/auth/login', { email, password });
        console.log("Respuesta completa de login:", response.data);

        // Guardar respuesta para depuración (sin contraseña)
        this.debugInfo.lastLoginResponse = { ...response.data, password: undefined };

        const { token } = response.data;
        if (!token) {
          throw new Error("No se recibió token de autenticación");
        }

        this.token = token;
        localStorage.setItem('token', token);

        // Configurar axios globalmente para futuras solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const decoded: any = this.decodeToken(token);
        console.log("Token decodificado:", decoded);

        // Guardar token decodificado para depuración
        this.debugInfo.decodedToken = { ...decoded };

        if (decoded) {
          // Crear objeto de usuario con todos los campos posibles
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            // Extraer información de rol de varias ubicaciones posibles
            role: decoded.role || decoded.rol,
            roles: decoded.roles,
            esAdmin: decoded.esAdmin || decoded.isAdmin,
            // Obtener información adicional
            telefono: decoded.telefono || '',
            direccion: decoded.direccion || ''
          };

          console.log("Usuario después de decodificar token:", this.user);
          console.log("¿Es administrador según token?", this.isAdmin);

          localStorage.setItem('user', JSON.stringify(this.user));

          // Obtener información completa del usuario desde la API
          await this.fetchUserData();

          // CRÍTICO: Asegurarnos de que el rol de administrador no se pierda si viene en el token
          if (!this.user.role && decoded.role) {
            this.user.role = decoded.role;
            localStorage.setItem('user', JSON.stringify(this.user));
          }

          console.log("Usuario después de fetchUserData:", this.user);
          console.log("¿Es administrador final?", this.isAdmin);

          // Actualizar estado de depuración
          this.debugInfo.finalUserState = { ...this.user };
          this.debugInfo.isAdminFinal = this.isAdmin;
        }

        toast.success(`¡Bienvenido, ${this.user.nombre}!`);
        return true;
      } catch (err) {
        console.error('Error en login:', err);
        this.error = 'Error al iniciar sesión';
        toast.error("Error al iniciar sesión.");

        // Guardar error para depuración
        this.debugInfo.lastLoginError = err;

        return false;
      } finally {
        this.loading = false;
      }
    },

    // Nuevo: método específico para administradores
    // En userStore.ts
    async adminLogin(email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        console.log(`Intentando iniciar sesión de ADMINISTRADOR con email: ${email}`);

        // Intentar con login normal primero
        const response = await axios.post('/api/auth/login', { email, password });

        console.log("Respuesta de login:", response.data);

        const { token } = response.data;
        if (!token) {
          throw new Error("No se recibió token de autenticación");
        }

        this.token = token;
        localStorage.setItem('token', token);

        // Configurar axios para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const decoded: any = this.decodeToken(token);
        console.log("Token decodificado (admin):", decoded);

        if (decoded) {
          // Asegurarnos de que se establezca como administrador
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            // Forzar rol de administrador
            role: 'Admin',
            esAdmin: true,
            // Otros campos
            telefono: decoded.telefono || '',
            direccion: decoded.direccion || ''
          };

          console.log("Usuario admin después de decodificar token:", this.user);
          localStorage.setItem('user', JSON.stringify(this.user));

          await this.fetchUserData();

          // CRÍTICO: Asegurarnos de que mantenemos el rol admin
          if (!this.user.role || this.user.role !== 'Admin') {
            console.log("Forzando rol de administrador después de fetchUserData");
            this.user.role = 'Admin';
            this.user.esAdmin = true;
            localStorage.setItem('user', JSON.stringify(this.user));
          }

          console.log("Usuario admin final:", this.user);
          console.log("¿Es administrador?", this.isAdmin);
        }

        // Verificar si realmente es administrador después de todo
        if (!this.isAdmin) {
          console.error("Este usuario no tiene permisos de administrador");
          toast.error("No tienes permisos de administrador.");
          this.logout();
          return false;
        }

        toast.success(`¡Bienvenido, administrador ${this.user.nombre}!`);
        return true;
      } catch (err) {
        console.error('Error en adminLogin:', err);
        this.error = 'Error al iniciar sesión como administrador';
        toast.error("Error al iniciar sesión como administrador.");
        return false;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('/api/Auth/reset-password', {
          token,
          newPassword
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        toast.success("Contraseña restablecida correctamente.");
        return response.data;
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        this.error = 'No se pudo restablecer la contraseña.';
        toast.error("Error al restablecer la contraseña.");
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async googleLogin(idToken: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await axios.post('/api/auth/google-login', { idToken });
        const { token } = response.data;
        if (!token) return;
        this.token = token;
        localStorage.setItem('token', token);
        localStorage.setItem('isGoogleUser', 'true');
        this.isGoogleUser = true;
        const decoded: any = this.decodeToken(token);
        if (decoded) {
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role
          };
          localStorage.setItem('user', JSON.stringify(this.user));
          await this.fetchUserData();
        }
        toast.success(`¡Bienvenido, ${this.user.nombre}!`);
      } catch (err) {
        console.error('Error en googleLogin:', err);
        toast.error("Error al iniciar sesión con Google.");
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = '';
      this.user = null;
      this.isGoogleUser = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isGoogleUser');

      // Eliminar token de axios
      delete axios.defaults.headers.common['Authorization'];

      const cartStore = useCartStore();
      cartStore.clearCart();

      toast.info("Sesión cerrada correctamente.");
    },

    initialize() {
      console.log("Inicializando UserStore...");
      if (this.token) {
        console.log("Token encontrado, configurando axios...");
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        const decoded: any = this.decodeToken(this.token);
        console.log("Token decodificado en initialize:", decoded);

        if (decoded) {
          // Establecer información básica del usuario desde el token
          this.user = {
            id: decoded.sub,
            email: decoded.email,
            nombre: decoded.name || decoded.email,
            role: decoded.role,
            telefono: this.user?.telefono || '',
            direccion: this.user?.direccion || ''
          };

          // Obtener datos completos del usuario
          console.log("Obteniendo datos completos del usuario...");
          this.fetchUserData().then(() => {
            console.log("Usuario inicializado correctamente");
            console.log("Estado final de isAdmin:", this.isAdmin);
          }).catch(err => {
            console.error("Error al inicializar usuario:", err);
          });
        } else {
          console.warn("Token inválido, cerrando sesión");
          this.logout();
        }
      } else {
        console.log("No hay token, usuario no autenticado");
      }
    }
  }
});