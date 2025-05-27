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
        const response = await axios.get<Usuario[]>('/api/Usuario', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = response.data;
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

    async updateUser(user: Usuario) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put<Usuario>(`/api/Usuario/${user.id}`, user, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = response.data;
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
        await axios.delete(`/api/Usuario/${userId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        this.users = this.users.filter(u => u.id !== userId);
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
        const response = await axios.get<Producto[]>('/api/Producto', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = response.data;
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
        const response = await axios.post<Producto>('/api/Producto', product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Añadir a la lista local
        this.products.push(response.data);

        return response.data;
      } catch (error: any) {
        console.error('Error creating product:', error);
        this.error = error.response?.data?.message || 'Error al crear producto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(product: Producto) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put<Producto>(`/api/Producto/${product.id}`, product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = response.data;
        }

        return response.data;
      } catch (error: any) {
        console.error('Error updating product:', error);
        this.error = error.response?.data?.message || 'Error al actualizar producto';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(productId: number) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`/api/Producto/${productId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        this.products = this.products.filter(p => p.id !== productId);
        return true;
      } catch (error: any) {
        console.error('Error deleting product:', error);
        this.error = error.response?.data?.message || 'Error al eliminar producto';
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
        const response = await axios.get<Categoria[]>('/api/Categoria', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.categories = response.data;
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
        const response = await axios.get<Pedido[]>('/api/Pedido', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Formatear fechas para visualización
        this.orders = response.data.map(order => ({
          ...order,
          // Asegurar consistencia en el formato de la fecha
          fechaFormateada: parseFechaPedido(order.fechaPedido)
        }));
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
        await axios.delete(`/api/Pedido/${orderId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        this.orders = this.orders.filter(o => o.id !== orderId);
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
        const response = await axios.get<Proveedor[]>('/api/Proveedor', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.providers = response.data;
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
        const response = await axios.post<Proveedor>('/api/Proveedor', provider, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

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
        const response = await axios.put<Proveedor>(`/api/Proveedor/${provider.id}`, provider, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        const index = this.providers.findIndex(p => p.id === provider.id);
        if (index !== -1) {
          this.providers[index] = response.data;
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
        await axios.delete(`/api/Proveedor/${providerId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        // Actualizar la lista local
        this.providers = this.providers.filter(p => p.id !== providerId);
        return true;
      } catch (error: any) {
        console.error('Error deleting provider:', error);
        this.error = error.response?.data?.message || 'Error al eliminar proveedor';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: { nombre: string; email: string; password: string; esAdmin: boolean; telefono?: string; direccion?: string }) {
      this.loading = true;
      this.error = null;
      try {
        // Usar el endpoint de registro pero con datos de admin
        const response = await axios.post('/api/Auth/register', {
          nombre: userData.nombre,
          email: userData.email,
          password: userData.password,
          // Incluir campos adicionales si el backend los acepta
          esAdmin: userData.esAdmin,
          telefono: userData.telefono,
          direccion: userData.direccion
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        });

        // Recargar la lista de usuarios para incluir el nuevo usuario
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

    // Método para inicializar todos los datos
    async fetchAllData() {
      try {
        await Promise.all([
          this.fetchAllUsers(),
          this.fetchAllProducts(),
          this.fetchAllOrders(),
          this.fetchAllProviders(),
          this.fetchAllCategories()
        ]);
        return true;
      } catch (error) {
        console.error('Error fetching all data:', error);
        return false;
      }
    }
  }
});