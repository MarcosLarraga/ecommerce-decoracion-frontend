// adminStore.ts
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
  
  interface Pedido {
    id: number;
    usuarioId: number; // Relación con el usuario
    fecha: string; // Fecha como cadena
    total: number; // Total del pedido
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
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Usuario[]>('http://localhost:5162/api/Usuario', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.error = 'Error al obtener usuarios';
      } finally {
        this.loading = false;
      }
    },

    async fetchAllProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Producto[]>('http://localhost:5162/api/Producto', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Error al obtener productos';
      } finally {
        this.loading = false;
      }
    },

    async fetchAllOrders() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Pedido[]>('http://localhost:5162/api/Pedido', {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = 'Error al obtener pedidos';
      } finally {
        this.loading = false;
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

    async updateProduct(product: Producto) {
      this.error = null;
      try {
        const response = await axios.put(`http://localhost:5162/api/Producto/${product.id}`, product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
      } catch (error) {
        console.error('Error updating product:', error);
        this.error = 'Error al actualizar producto';
      }
    },

    async createProduct(product: Omit<Producto, 'id'>) {
      this.error = null;
      try {
        const response = await axios.post('http://localhost:5162/api/Producto', product, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.products.push(response.data);
      } catch (error) {
        console.error('Error creating product:', error);
        this.error = 'Error al crear producto';
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

    async updateOrderStatus(orderId: number, newStatus: string) {
      this.error = null;
      try {
        const response = await axios.put(`http://localhost:5162/api/Pedido/${orderId}`, { estado: newStatus }, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = response.data;
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        this.error = 'Error al actualizar estado del pedido';
      }
    }
  }
});
