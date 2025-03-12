import { defineStore } from 'pinia';
import axios from 'axios';

export const useReseñaStore = defineStore('reseña', {
  state: () => ({
    reseñas: [] as any[], 
    promedioCalificacion: 0, 
  }),

  actions: {
    // Obtener todas las reseñas de un producto
    async fetchReseñasByProductoId(productoId: number) {
      try {
        const response = await axios.get(`/api/Reseña/producto/${productoId}`);
        this.reseñas = response.data;
      } catch (error) {
        console.error(" Error obteniendo reseñas:", error);
      }
    },

    // Obtener el promedio de calificación de un producto
    async fetchPromedioCalificacion(productoId: number) {
      try {
        const response = await axios.get(`/api/Reseña/producto/${productoId}/promedio`);
        this.promedioCalificacion = response.data;
      } catch (error) {
        console.error(" Error obteniendo el promedio de calificación:", error);
        this.promedioCalificacion = 0; // Evita errores en el frontend
      }      
    },

    // Agregar una reseña
    async agregarReseña(productoId: number, usuarioId: number, comentario: string, calificacion: number) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No hay token disponible. Inicia sesión.");
        }

        const response = await axios.post(
          "/api/Reseña",
          {
            productoId,
            usuarioId,
            comentario,
            calificacion
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        this.reseñas.push(response.data);
        await this.fetchPromedioCalificacion(productoId);
      } catch (error) {
        console.error(" Error al agregar reseña:", error);
        throw new Error("No se pudo agregar la reseña.");
      }
    },

    //  Nuevo método para eliminar reseñas
    async eliminarReseña(reseñaId: number) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No hay token disponible. Inicia sesión.");
        }

        await axios.delete(`/api/Reseña/${reseñaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        this.reseñas = this.reseñas.filter(r => r.id !== reseñaId);
        console.log(` Reseña ${reseñaId} eliminada correctamente`);
      } catch (error) {
        console.error(" Error al eliminar la reseña:", error);
        throw new Error("No se pudo eliminar la reseña.");
      }
    }
  }
});