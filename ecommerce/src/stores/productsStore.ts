import { defineStore } from 'pinia';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoriaId: number;
  urlImagen: string;
  descripcion: string;
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    allProducts: [] as Producto[],
    randomProducts: [] as Producto[],  // Productos aleatorios
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Obtener todos los productos
    async fetchProducts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('http://localhost:5162/api/Producto');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        this.allProducts = data;
        this.getRandomProducts(); // Seleccionamos los 4 productos aleatorios después de obtener todos
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Hubo un error';
      } finally {
        this.loading = false;
      }
    },

    // Seleccionar 4 productos aleatorios de la lista de todos los productos
    getRandomProducts() {
      const shuffled = [...this.allProducts].sort(() => 0.5 - Math.random()); // Mezcla los productos aleatoriamente
      this.randomProducts = shuffled.slice(0, 4); // Selecciona los primeros 4 productos aleatorios
    },
  },
});
