import { defineStore } from 'pinia';
import axios from 'axios';
import { useCartStore } from './cartStore';

export const useDetallePedidoStore = defineStore('detallePedido', {
  state: () => ({
    detallesPedido: [] as any[], // Detalles de los productos en el pedido
    usuario: null as any,         // Información del usuario
    pedido: null as any,          // Información completa del pedido
  }),

  actions: {
    // ✅ Obtener los detalles de un pedido por su ID
    async fetchDetallesPedido(pedidoId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/DetallePedido/pedido/${pedidoId}`);
        
        console.log("Detalles del pedido:", response.data); // Depuración

        if (response.data && response.data.length > 0) {
          this.detallesPedido = response.data;

          // Verificar si la propiedad 'pedido' existe y contiene 'usuarioId'
          const usuarioId = this.detallesPedido[0]?.pedido?.usuarioId;
          if (usuarioId) {
            await this.fetchUsuarioByPedidoId(usuarioId);
          } else {
            console.error("❌ No se encontró el usuarioId en los detalles del pedido.");
            throw new Error("No se pudo obtener el usuario asociado al pedido.");
          }
        } else {
          console.error("❌ No se encontraron detalles del pedido.");
          throw new Error("No se encontraron detalles del pedido.");
        }
      } catch (error) {
        console.error("❌ Error obteniendo detalles del pedido:", error);
        throw new Error("No se pudo obtener el detalle del pedido.");
      }
    },

    // ✅ Obtener los datos del usuario por su ID
    async fetchUsuarioByPedidoId(usuarioId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/Usuario/${usuarioId}`);
        this.usuario = response.data;
      } catch (error) {
        console.error("❌ Error obteniendo el usuario:", error);
        throw new Error("No se pudo obtener el usuario.");
      }
    },

    // ✅ Agregar detalles de pedido a la base de datos
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

    // ✅ Eliminar un detalle de pedido
    async eliminarDetallePedido(detalleId: number) {
      try {
        await axios.delete(`http://localhost:5162/api/DetallePedido/${detalleId}`);
        this.detallesPedido = this.detallesPedido.filter((detalle) => detalle.id !== detalleId);
      } catch (error) {
        console.error("❌ Error al eliminar el detalle del pedido:", error);
        throw new Error("No se pudo eliminar el detalle del pedido.");
      }
    },

    // ✅ **Nuevo Método: Obtener un Pedido Completo con Usuario y Productos**
    async fetchPedidoById(pedidoId: number) {
      try {
        const response = await axios.get(`http://localhost:5162/api/Pedido/${pedidoId}`);
        
        console.log("Pedido completo obtenido:", response.data); // Depuración
        
        if (!response.data) {
          throw new Error("Pedido no encontrado.");
        }

        this.pedido = response.data;
        this.usuario = response.data.usuario;  // Usuario del pedido
        this.detallesPedido = response.data.detalles;  // Productos del pedido

      } catch (error) {
        console.error("❌ Error obteniendo el pedido:", error);
        throw new Error("No se pudo obtener el pedido.");
      }
    },
  },
});
