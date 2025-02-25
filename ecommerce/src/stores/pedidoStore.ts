import { defineStore } from 'pinia';
import axios from 'axios';
import { useCartStore } from './cartStore';

export const usePedidoStore = defineStore('pedido', {
  state: () => ({
    pedido: null as any,
  }),

  actions: {
    async confirmarPedido(usuarioId: number, direccion: string, telefono: string, productos: any[], total: number) {
      try {
        const response = await axios.post("http://localhost:5162/api/Pedido", {
          usuarioId,
          direccion,
          telefono,
          productos,
          total,
        });

        this.pedido = response.data;
        useCartStore().clearCart();
      } catch (error) {
        console.error("Error al confirmar el pedido:", error);
      }
    },

    async fetchPedidoDetalle(pedidoId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/Pedido/${pedidoId}`);
        this.pedido = response.data;
      } catch (error) {
        console.error("Error obteniendo detalles del pedido:", error);
      }
    },
  },
});
