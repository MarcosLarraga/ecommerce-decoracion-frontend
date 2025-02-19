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
    allProducts: [] as ProductoDTO[], // Lista de productos obtenidos desde la API
    randomProducts: [] as ProductoDTO[], // Productos aleatorios seleccionados
    loading: false, // Estado de carga
    error: null as string | null, // Mensaje de error si ocurre algún problema
  }),

  actions: {
    /**
     * Obtiene todos los productos desde la API y los almacena en el estado.
     */
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      console.log("⏳ [fetchProducts] Iniciando la carga de productos...");

      try {
        // Petición al endpoint que devuelve productos en formato ProductoDTO
        const response = await fetch('http://localhost:5162/api/Producto/dto', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`❌ Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ProductoDTO[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("❌ Error: La API no devolvió una lista de productos.");
        }

        console.log("✅ [fetchProducts] Productos obtenidos correctamente:", data);

        this.allProducts = data; // Guardamos los productos en el estado
        this.getRandomProducts(); // Seleccionamos productos aleatorios

      } catch (error) {
        this.error = error instanceof Error ? error.message : '❌ Error desconocido al obtener productos';
        console.error("⚠️ [fetchProducts] Error:", this.error);

      } finally {
        this.loading = false;
        console.log("✅ [fetchProducts] Proceso finalizado.");
      }
    },

    /**
     * Selecciona 5 productos aleatorios de la lista obtenida de la API.
     */
    getRandomProducts() {
      if (this.allProducts.length === 0) {
        console.warn("⚠️ [getRandomProducts] No hay productos para seleccionar aleatoriamente.");
        return;
      }

      // Mezcla los productos aleatoriamente y selecciona los primeros 5
      const shuffled = [...this.allProducts].sort(() => 0.5 - Math.random());
      this.randomProducts = shuffled.slice(0, 5);

      console.log("🔀 [getRandomProducts] Productos aleatorios seleccionados:", this.randomProducts);
    }
  }
});
