// stores/adminStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  esAdmin: boolean;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoriaId: number;
  proveedorId: number | null;
  urlImagen: string;
  descripcion: string;
  categoria?: {
    id: number;
    nombre: string;
  };
  proveedor?: {
    id: number;
    nombre: string;
  };
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  urlImagen: string;
}

interface Proveedor {
  id: number;
  nombre: string;
  direccion: string;
  nif: string;
  telefono: string;
  email: string;
  personaContacto: string;
}

interface DetallePedido {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  producto?: Producto;
}

interface Pedido {
  id: number;
  usuarioId: number;
  fechaPedido: string;
  total: number;
  detalles?: DetallePedido[];
  usuario?: Usuario;
  fechaFormateada?: string;
}

// Helper para parsear fechas
function parseFechaPedido(dateStr: string): string {
  if (!dateStr) return '';

  let date: Date;
  // Si es un string de fecha ISO
  if (typeof dateStr === 'string') {
    // Verificar si es formato /Date(timestamp)/
    const match = dateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
      date = new Date(parseInt(match[1]));
    } else {
      date = new Date(dateStr);
    }
  } else {
    date = new Date(dateStr);
  }

  if (isNaN(date.getTime())) return 'Fecha inválida';

  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as Usuario[],
    products: [] as Producto[],
    orders: [] as Pedido[],
    providers: [] as Proveedor[],
    categories: [] as Categoria[],
    loading: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find(u => u.id === id);
    },
    getProductById: (state) => (id: number) => {
      return state.products.find(p => p.id === id);
    },
    getOrderById: (state) => (id: number) => {
      return state.orders.find(o => o.id === id);
    },
    getProviderById: (state) => (id: number) => {
      return state.providers.find(p => p.id === id);
    },
    getCategoryById: (state) => (id: number) => {
      return state.categories.find(c => c.id === id);
    }
  },

  actions: {
    setAuthToken(token: string) {
      this.token = token;
    },

    // ========== MÉTODOS PARA USUARIOS ==========
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Cargando usuarios...');
        const response = await axios.get<Usuario[]>('/api/Usuario', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = response.data;
        console.log('Usuarios cargados:', this.users.length);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        this.error = error.response?.data?.message || 'Error al obtener usuarios';
      } finally {
        this.loading = false;
      }
    },

    async getUserDetails(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Usuario>(`/api/Usuario/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching user details:', error);
        this.error = error.response?.data?.message || `Error al obtener detalles del usuario ${id}`;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: {
      nombre: string;
      email: string;
      password: string;
      esAdmin: boolean;
      telefono?: string;
      direccion?: string;
    }) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Creando usuario desde admin:', userData);

        const response = await axios.post('/api/Auth/register', {
          nombre: userData.nombre,
          email: userData.email,
          password: userData.password,
          esAdmin: userData.esAdmin,
          telefono: userData.telefono || '',
          direccion: userData.direccion || ''
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Usuario creado:', response.data);

        // CRÍTICO: Siempre recargar la lista completa después de crear
        // Esto asegura que tenemos todos los datos actualizados del usuario
        console.log('Recargando lista de usuarios para obtener datos completos...');
        await this.fetchAllUsers();

        return response.data;
      } catch (error: any) {
        console.error('Error creating user:', error);
        this.error = error.response?.data?.message || 'Error al crear usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(user: Usuario) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Actualizando usuario:', user);

        const response = await axios.put<Usuario>(`/api/Usuario/${user.id}`, user, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        console.log('Respuesta del servidor:', response.data);

        // Actualizar la lista local con los datos devueltos por el servidor
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = { ...response.data };
          console.log('Usuario actualizado en la lista local:', this.users[index]);
        } else {
          console.warn('No se encontró el usuario en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllUsers();
        }

        return response.data;
      } catch (error: any) {
        console.error("Error updating user:", error);
        this.error = error.response?.data?.message || "Error al actualizar usuario";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId: number) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Eliminando usuario con ID:', userId);

        await axios.delete(`/api/Usuario/${userId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Remover el usuario de la lista local
        const index = this.users.findIndex(u => u.id === userId);
        if (index !== -1) {
          this.users.splice(index, 1);
          console.log('Usuario eliminado de la lista local');
        } else {
          console.warn('No se encontró el usuario en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllUsers();
        }

        return true;
      } catch (error: any) {
        console.error('Error deleting user:', error);
        this.error = error.response?.data?.message || 'Error al eliminar usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== MÉTODOS PARA PRODUCTOS ==========
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Cargando productos...');
        const response = await axios.get<Producto[]>('/api/Producto', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = response.data;
        console.log('Productos cargados:', this.products.length);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        this.error = error.response?.data?.message || 'Error al obtener productos';
      } finally {
        this.loading = false;
      }
    },

    async getProductDetails(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Producto>(`/api/Producto/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching product details:', error);
        this.error = error.response?.data?.message || `Error al obtener detalles del producto ${id}`;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(product: Omit<Producto, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Creando producto:', product);

        const response = await axios.post<Producto>('/api/Producto', product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        console.log('Producto creado:', response.data);

        // Agregar el nuevo producto a la lista local
        this.products.push(response.data);

        return response.data;
      } catch (error: any) {
        console.error("Error creating product:", error);
        this.error = error.response?.data?.message || "Error al crear producto";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(product: Producto) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Actualizando producto:', product);

        const response = await axios.put<Producto>(`/api/Producto/${product.id}`, product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        console.log('Respuesta del servidor:', response.data);

        // Actualizar la lista local con los datos devueltos por el servidor
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = { ...response.data };
          console.log('Producto actualizado en la lista local:', this.products[index]);
        } else {
          console.warn('No se encontró el producto en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllProducts();
        }

        return response.data;
      } catch (error: any) {
        console.error("Error updating product:", error);
        this.error = error.response?.data?.message || "Error al actualizar producto";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(productId: number) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Eliminando producto con ID:', productId);

        await axios.delete(`/api/Producto/${productId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Remover el producto de la lista local
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
          this.products.splice(index, 1);
          console.log('Producto eliminado de la lista local');
        } else {
          console.warn('No se encontró el producto en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllProducts();
        }

      } catch (error: any) {
        console.error("Error deleting product:", error);
        this.error = error.response?.data?.message || "Error al eliminar producto";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== MÉTODOS PARA CATEGORÍAS ==========
    async fetchAllCategories() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Cargando categorías...');
        const response = await axios.get<Categoria[]>('/api/Categoria', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.categories = response.data;
        console.log('Categorías cargadas:', this.categories.length);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        this.error = error.response?.data?.message || 'Error al obtener categorías';
      } finally {
        this.loading = false;
      }
    },

    // ========== MÉTODOS PARA PEDIDOS ==========
    async fetchAllOrders() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Cargando pedidos...');
        const response = await axios.get<Pedido[]>('/api/Pedido', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Formatear fechas para visualización
        this.orders = response.data.map(order => ({
          ...order,
          fechaFormateada: parseFechaPedido(order.fechaPedido)
        }));

        console.log('Pedidos cargados:', this.orders.length);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        this.error = error.response?.data?.message || 'Error al obtener pedidos';
      } finally {
        this.loading = false;
      }
    },

    async getOrderDetails(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Pedido>(`/api/Pedido/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Incluir fecha formateada
        const orderWithFormattedDate = {
          ...response.data,
          fechaFormateada: parseFechaPedido(response.data.fechaPedido)
        };

        return orderWithFormattedDate;
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        this.error = error.response?.data?.message || `Error al obtener detalles del pedido ${id}`;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteOrder(orderId: number) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Eliminando pedido con ID:', orderId);

        await axios.delete(`/api/Pedido/${orderId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Remover el pedido de la lista local
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders.splice(index, 1);
          console.log('Pedido eliminado de la lista local');
        } else {
          console.warn('No se encontró el pedido en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllOrders();
        }

        return true;
      } catch (error: any) {
        console.error('Error deleting order:', error);
        this.error = error.response?.data?.message || 'Error al eliminar pedido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== MÉTODOS PARA PROVEEDORES ==========
    async fetchAllProviders() {
      this.loading = true;
      this.error = null;
      try {
        console.log('Cargando proveedores...');
        const response = await axios.get<Proveedor[]>('/api/Proveedor', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.providers = response.data;
        console.log('Proveedores cargados:', this.providers.length);
      } catch (error: any) {
        console.error('Error fetching providers:', error);
        this.error = error.response?.data?.message || 'Error al obtener proveedores';
      } finally {
        this.loading = false;
      }
    },

    async getProviderDetails(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Proveedor>(`/api/Proveedor/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        return response.data;
      } catch (error: any) {
        console.error('Error fetching provider details:', error);
        this.error = error.response?.data?.message || `Error al obtener detalles del proveedor ${id}`;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createProvider(provider: Omit<Proveedor, 'id'>) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Creando proveedor:', provider);

        const response = await axios.post<Proveedor>('/api/Proveedor', provider, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        console.log('Proveedor creado:', response.data);

        // Añadir a la lista local
        this.providers.push(response.data);

        return response.data;
      } catch (error: any) {
        console.error('Error creating provider:', error);
        this.error = error.response?.data?.message || 'Error al crear proveedor';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProvider(provider: Proveedor) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Actualizando proveedor:', provider);

        const response = await axios.put<Proveedor>(`/api/Proveedor/${provider.id}`, provider, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        console.log('Respuesta del servidor:', response.data);

        // Actualizar la lista local con los datos devueltos por el servidor
        const index = this.providers.findIndex(p => p.id === provider.id);
        if (index !== -1) {
          this.providers[index] = { ...response.data };
          console.log('Proveedor actualizado en la lista local:', this.providers[index]);
        } else {
          console.warn('No se encontró el proveedor en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllProviders();
        }

        return response.data;
      } catch (error: any) {
        console.error('Error updating provider:', error);
        this.error = error.response?.data?.message || 'Error al actualizar proveedor';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProvider(providerId: number) {
      this.loading = true;
      this.error = null;
      try {
        console.log('Eliminando proveedor con ID:', providerId);

        await axios.delete(`/api/Proveedor/${providerId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Remover el proveedor de la lista local
        const index = this.providers.findIndex(p => p.id === providerId);
        if (index !== -1) {
          this.providers.splice(index, 1);
          console.log('Proveedor eliminado de la lista local');
        } else {
          console.warn('No se encontró el proveedor en la lista local');
          // Si no se encuentra, recargar toda la lista
          await this.fetchAllProviders();
        }

        return true;
      } catch (error: any) {
        console.error('Error deleting provider:', error);
        this.error = error.response?.data?.message || 'Error al eliminar proveedor';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Método para inicializar todos los datos
    async fetchAllData() {
      try {
        console.log('Cargando todos los datos del admin...');
        await Promise.all([
          this.fetchAllUsers(),
          this.fetchAllProducts(),
          this.fetchAllOrders(),
          this.fetchAllProviders(),
          this.fetchAllCategories()
        ]);
        console.log('Todos los datos cargados correctamente');
        return true;
      } catch (error) {
        console.error('Error fetching all data:', error);
        return false;
      }
    }
  }
});