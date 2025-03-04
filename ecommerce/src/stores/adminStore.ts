import { defineStore } from 'pinia';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  role: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
}

interface DetallePedido {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

interface Pedido {
  id: number;
  usuarioId: number;
  FechaPedido: Date;
  total: number;
  detalles?: DetallePedido[];
}

/**
 * Función auxiliar para parsear la fecha.
 * Se contempla que el string puede venir como "FechaPedido" o "fechaPedido",
 * o incluso en formato .NET (/Date(1234567890)/).
 */
function parseFechaPedido(dateStr: string): Date {
  let date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    // Intenta extraer el timestamp del formato .NET: /Date(1648763622000)/
    const match = dateStr.match(/\/Date\((\d+)\)\//);
    if (match) {
      date = new Date(parseInt(match[1]));
    }
  }
  return date;
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as Usuario[],
    products: [] as Producto[],
    orders: [] as Pedido[],
    loading: false,
    error: null as string | null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    // ======================
    //  MÉTODOS PARA USUARIOS
    // ======================
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<any[]>('http://localhost:5162/api/Usuario', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = response.data.map(user => ({
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          role: user.esAdmin ? 'Admin' : 'Usuario'
        }));
      } catch (error) {
        console.error('Error fetching users:', error);
        this.error = 'Error al obtener usuarios';
      } finally {
        this.loading = false;
      }
    },

    async updateUser(user: Usuario) {
      this.error = null;
      try {
        await axios.put(`http://localhost:5162/api/Usuario/${user.id}`, user, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
        }
      } catch (error) {
        console.error('Error updating user:', error);
        this.error = 'Error al actualizar usuario';
      }
    },

    async deleteUser(userId: number) {
      this.error = null;
      try {
        await axios.delete(`http://localhost:5162/api/Usuario/${userId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = this.users.filter(u => u.id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
        this.error = 'Error al eliminar usuario';
      }
    },

    // ========================
    //  MÉTODOS PARA PRODUCTOS
    // ========================
    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<any[]>('http://localhost:5162/api/Producto', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = response.data.map(prod => ({
          id: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          // Se contempla que la propiedad pueda venir en PascalCase o camelCase
          categoria: prod.categoriaNombre || prod.CategoriaNombre || 'Sin Categoría'
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Error al obtener productos';
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(product: Producto) {
      this.error = null;
      try {
        await axios.put(`http://localhost:5162/api/Producto/${product.id}`, product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = product;
        }
      } catch (error) {
        console.error('Error updating product:', error);
        this.error = 'Error al actualizar producto';
      }
    },

    async deleteProduct(productId: number) {
      this.error = null;
      try {
        await axios.delete(`http://localhost:5162/api/Producto/${productId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = this.products.filter(p => p.id !== productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        this.error = 'Error al eliminar producto';
      }
    },

    // ======================
    //  MÉTODOS PARA PEDIDOS
    // ======================
    async fetchAllOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<any[]>('http://localhost:5162/api/Pedido', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.orders = response.data.map((order: any) => ({
          ...order,
          // Se utiliza la función auxiliar para parsear la fecha
          FechaPedido: parseFechaPedido(order.FechaPedido || order.fechaPedido)
        }));
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'Error al obtener pedidos';
      } finally {
        this.loading = false;
      }
    },

    async updateOrder(order: Pedido) {
      this.error = null;
      try {
        await axios.put(`http://localhost:5162/api/Pedido/${order.id}`, order, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.orders.findIndex(o => o.id === order.id);
        if (index !== -1) {
          this.orders[index] = order;
        }
      } catch (error) {
        console.error('Error updating order:', error);
        this.error = 'Error al actualizar pedido';
      }
    },

    async deleteOrder(orderId: number) {
      this.error = null;
      try {
        await axios.delete(`http://localhost:5162/api/Pedido/${orderId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.orders = this.orders.filter(o => o.id !== orderId);
      } catch (error) {
        if (error.response) {
          // Extract the detailed error message from the response
          const errorMessage = error.response.data;
          console.error('Error deleting order:', errorMessage);
          this.error = `Error al eliminar pedido: ${errorMessage}`;
        } else {
          console.error('Error deleting order:', error);
          this.error = 'Error al eliminar pedido';
        }
        throw error;
      }
    }

  }
});
