import { defineStore } from 'pinia';
import axios from 'axios';

export const usePedidoStore = defineStore('pedido', {
  state: () => ({
    pedidos: [] as any[],
    pedido: null as any,
  }),

  actions: {
    async crearPedidoConDetalles(usuarioId: number, productos: any[], total: number) {
      if (!productos || productos.length === 0) {
        throw new Error("No puedes realizar un pedido sin productos.");
      }

      try {
        const response = await axios.post("http://localhost:5162/api/Pedido", {
          usuarioId,
          total,
          fechaPedido: new Date().toISOString(),
        });

        const pedidoId = response.data.id;
        if (!pedidoId) {
          throw new Error("Error al crear el pedido.");
        }

        return pedidoId;
      } catch (error) {
        console.error("Error al crear el pedido:", error);
        throw new Error("No se pudo completar el pedido.");
      }
    },

    async fetchPedidosByUser(userId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/Pedido/user/${userId}`);
        this.pedidos = response.data;
      } catch (error) {
        console.error("Error obteniendo pedidos del usuario:", error);
        throw new Error("No se pudieron cargar los pedidos.");
      }
    },

    async fetchPedidoById(pedidoId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/Pedido/${pedidoId}`);
        this.pedido = response.data;
      } catch (error) {
        console.error("Error obteniendo pedido:", error);
        throw new Error("No se pudo cargar el pedido.");
      }
    },
  },
});
