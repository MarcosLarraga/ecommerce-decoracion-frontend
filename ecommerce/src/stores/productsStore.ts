import { defineStore } from 'pinia';

// Definimos la estructura del ProductoDTO
interface ProductoDTO {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  urlImagen: string;
  categoriaId: number; // Agregado para filtrar por categoría
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    allProducts: [] as ProductoDTO[], // Lista de productos obtenidos desde la API
    randomProducts: [] as ProductoDTO[], // Productos aleatorios seleccionados
    filteredProducts: [] as ProductoDTO[], // Productos filtrados por categoría
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
      console.log("⏳ [fetchProducts] Cargando productos...");

      try {
        // Nueva URL del endpoint sin "/dto"
        const response = await fetch('http://localhost:5162/api/Producto', {
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
     * Filtra los productos por una categoría específica.
     */
    async fetchProductsByCategory(categoriaId: number) {
      this.loading = true;
      this.error = null;
      console.log(`⏳ [fetchProductsByCategory] Cargando productos de la categoría ${categoriaId}...`);

      try {
        const response = await fetch(`http://localhost:5162/api/Producto/categoria/${categoriaId}`, {
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

        console.log(`✅ [fetchProductsByCategory] Productos de la categoría ${categoriaId} obtenidos:`, data);

        this.filteredProducts = data; // Guardamos los productos filtrados en el estado

      } catch (error) {
        this.error = error instanceof Error ? error.message : '❌ Error desconocido al obtener productos';
        console.error("⚠️ [fetchProductsByCategory] Error:", this.error);

      } finally {
        this.loading = false;
        console.log("✅ [fetchProductsByCategory] Proceso finalizado.");
      }
    },

    /**
     * Realiza la búsqueda de productos por nombre.
     */
    async searchProducts(query: string) {
      this.loading = true;
      this.error = null;
      console.log(`⏳ [searchProducts] Buscando productos con query: "${query}"...`);

      try {
        const response = await fetch(`http://localhost:5162/api/Producto/search?query=${encodeURIComponent(query)}`, {
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

        console.log("✅ [searchProducts] Productos encontrados:", data);

        this.allProducts = data; // Actualizamos la lista de productos con los resultados de la búsqueda
        this.getRandomProducts(); // Actualizamos los productos aleatorios si lo necesitas

      } catch (error) {
        this.error = error instanceof Error ? error.message : '❌ Error desconocido al buscar productos';
        console.error("⚠️ [searchProducts] Error:", this.error);

      } finally {
        this.loading = false;
        console.log("✅ [searchProducts] Proceso finalizado.");
      }
    },

    /**
     * Selecciona 4 productos aleatorios de la lista obtenida de la API.
     */
    getRandomProducts() {
      if (this.allProducts.length === 0) {
        console.warn("⚠️ [getRandomProducts] No hay productos para seleccionar aleatoriamente.");
        return;
      }

      // Mezcla los productos aleatoriamente y selecciona los primeros 4
      const shuffled = [...this.allProducts].sort(() => 0.5 - Math.random());
      this.randomProducts = shuffled.slice(0, 4);

      console.log("🔀 [getRandomProducts] Productos aleatorios seleccionados:", this.randomProducts);
    }
  }
});
