import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

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
    
        console.log("Pedido creado correctamente");
        return pedidoId;
      } catch (error) {
        console.error("Error al crear el pedido:", error);
        throw new Error("No se pudo completar el pedido.");
      }
    },
    
    async fetchPedidosByUser(userId: number) {
      const toast = useToast();
      try {
        const response = await axios.get(`http://localhost:5162/api/Pedido/user/${userId}`);
        this.pedidos = response.data;
        toast.success("Pedidos cargados correctamente");
      } catch (error) {
        console.error("Error obteniendo pedidos del usuario:", error);
        toast.error("No se pudieron cargar los pedidos.");
        throw new Error("No se pudieron cargar los pedidos.");
      }
    },

    async fetchPedidoById(pedidoId: number) {
      const toast = useToast();
      try {
        const response = await axios.get(`http://localhost:5162/api/Pedido/${pedidoId}`);
        this.pedido = response.data;
        toast.success("Pedido cargado correctamente");
      } catch (error) {
        console.error("Error obteniendo pedido:", error);
        toast.error("No se pudo cargar el pedido.");
        throw new Error("No se pudo cargar el pedido.");
      }
    },
  },
});
