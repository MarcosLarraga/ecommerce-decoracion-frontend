import { defineStore } from 'pinia';

// Definimos la estructura del ProductoDTO
interface ProductoDTO {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  urlImagen: string;
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    allProducts: [] as ProductoDTO[], // Aquí usamos el DTO
    randomProducts: [] as ProductoDTO[], // Productos aleatorios
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Obtener todos los productos desde el endpoint que devuelve el DTO
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      console.log("⏳ fetchProducts() llamado, iniciando carga...");

      try {
        // Usamos el endpoint que retorna productos como ProductoDTO
        const response = await fetch('http://localhost:5162/api/Producto/dto');
        if (!response.ok) {
          throw new Error('❌ Error al obtener los productos');
        }

        const data = await response.json();
        console.log("✅ Productos obtenidos desde la API:", data); // Verifica los datos recibidos

        this.allProducts = data; // Asignamos directamente los productos DTO a allProducts
        this.getRandomProducts(); // Seleccionamos los 5 productos aleatorios después de obtener todos
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Hubo un error';
        console.error("⚠️ Error en fetchProducts:", this.error);
      } finally {
        this.loading = false;
        console.log("✅ fetchProducts() finalizado.");
      }
    },

    // Seleccionar 5 productos aleatorios de la lista de todos los productos
    getRandomProducts() {
      if (this.allProducts.length === 0) {
        console.warn("⚠️ No hay productos para seleccionar aleatoriamente.");
        return;
      }

      const shuffled = [...this.allProducts].sort(() => 0.5 - Math.random()); // Mezcla aleatoriamente los productos
      this.randomProducts = shuffled.slice(0, 5); // Selecciona los primeros 5 productos aleatorios

      console.log("🔀 Productos aleatorios seleccionados:", this.randomProducts);
    },
  },
});
