import { defineStore } from 'pinia';
import axios from 'axios';
import { useCartStore } from './cartStore';

export const useDetallePedidoStore = defineStore('detallePedido', {
  state: () => ({
    detallesPedido: [] as any[],
  }),

  actions: {
    // Obtener los detalles de un pedido por su ID
    async fetchDetallesPedido(pedidoId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/DetallePedido/pedido/${pedidoId}`);
        this.detallesPedido = response.data;
      } catch (error) {
        console.error("❌ Error obteniendo detalles del pedido:", error);
        throw new Error("No se pudo obtener el detalle del pedido.");
      }
    },

    // Agregar detalles de pedido a la base de datos
    async agregarDetallesPedido(pedidoId: number, productos: any[]) {
      if (!Array.isArray(productos) || productos.length === 0) {
        console.error("❌ Error: No hay productos para agregar al pedido.");
        throw new Error("No hay productos en el carrito.");
      }

      try {
        const detallesPedido = productos.map((producto) => ({
          pedidoId,
          productoId: producto.id,
          cantidad: producto.quantity,
          precioUnitario: producto.price,
        }));

        console.log("📌 Enviando detalles del pedido:", JSON.stringify(detallesPedido, null, 2));

        await axios.post("http://localhost:5162/api/DetallePedido", detallesPedido);

        useCartStore().clearCart();
      } catch (error) {
        console.error("❌ Error al agregar detalles del pedido:", error);
        throw new Error("No se pudieron agregar los detalles del pedido.");
      }
    },

    // Eliminar un detalle de pedido
    async eliminarDetallePedido(detalleId: number) {
      try {
        await axios.delete(`http://localhost:5162/api/DetallePedido/${detalleId}`);
        this.detallesPedido = this.detallesPedido.filter((detalle) => detalle.id !== detalleId);
      } catch (error) {
        console.error("❌ Error al eliminar el detalle del pedido:", error);
        throw new Error("No se pudo eliminar el detalle del pedido.");
      }
    },
  },
});
