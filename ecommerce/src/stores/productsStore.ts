import { defineStore } from 'pinia';

// Definimos la estructura del ProductoDTO
interface ProductoDTO {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  urlImagen: string;
  categoriaId: number; 
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    allProducts: [] as ProductoDTO[],      // Lista de productos que usaremos para el autocomplete y búsquedas
    randomProducts: [] as ProductoDTO[],     // Productos aleatorios seleccionados
    filteredProducts: [] as ProductoDTO[],   // Productos filtrados por categoría
    loading: false,                          // Estado de carga
    error: null as string | null,            // Mensaje de error en caso de problemas
    minProductPrice: 0,                      // Precio mínimo de los productos
    maxProductPrice: 1000,                   // Precio máximo de los productos
  }),

  actions: {
    //Calcula el precio mínimo y máximo de los productos disponibles.
     
    calculatePriceRange() {
      if (this.allProducts.length === 0) return;

      this.minProductPrice = Math.floor(
        Math.min(...this.allProducts.map(product => product.precio))
      );
      this.maxProductPrice = Math.ceil(
        Math.max(...this.allProducts.map(product => product.precio))
      );
      console.log(`[calculatePriceRange] Rango de precios calculado: ${this.minProductPrice}€ - ${this.maxProductPrice}€`);
    },

    //Obtiene todos los productos desde la API y los almacena en el estado.
  
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      console.log(" [fetchProducts] Cargando productos...");

      try {
        const response = await fetch('/api/Producto', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(` Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ProductoDTO[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(" Error: La API no devolvió una lista de productos.");
        }

        console.log(" [fetchProducts] Productos obtenidos correctamente:", data);
        this.allProducts = data;
        this.calculatePriceRange();
        this.getRandomProducts();

      } catch (error) {
        this.error = error instanceof Error ? error.message : ' Error desconocido al obtener productos';
        console.error(" [fetchProducts] Error:", this.error);

      } finally {
        this.loading = false;
      }
    },

    /**
     * Filtra los productos por una categoría específica.
     */
    async fetchProductsByCategory(categoriaId: number) {
      this.loading = true;
      this.error = null;
      console.log(` [fetchProductsByCategory] Cargando productos de la categoría ${categoriaId}...`);

      try {
        const response = await fetch(`/api/Producto/categoria/${categoriaId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(` Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ProductoDTO[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(" Error: La API no devolvió una lista de productos.");
        }

        console.log(` [fetchProductsByCategory] Productos de la categoría ${categoriaId} obtenidos:`, data);
        this.filteredProducts = data;
        this.calculatePriceRange();

      } catch (error) {
        this.error = error instanceof Error ? error.message : ' Error desconocido al obtener productos';
        console.error(" [fetchProductsByCategory] Error:", this.error);

      } finally {
        this.loading = false;
      }
    },

    /**
     * Realiza la búsqueda de productos por nombre.
     */
    async searchProducts(query: string) {
      this.loading = true;
      this.error = null;
      console.log(` [searchProducts] Buscando productos con query: "${query}"...`);

      try {
        const response = await fetch(`/api/Producto/search?query=${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(` Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data: ProductoDTO[] = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.warn(` No se encontraron productos para: "${query}"`);
          this.allProducts = []; // Limpiamos la lista para el autocomplete
          return;
        }

        console.log(" [searchProducts] Productos encontrados:", data);
        this.allProducts = data;
        this.calculatePriceRange();
        this.getRandomProducts();

      } catch (error) {
        this.error = error instanceof Error ? error.message : ' Error desconocido al buscar productos';
        console.error(" [searchProducts] Error:", this.error);

      } finally {
        this.loading = false;
      }
    },

    /**
     * Selecciona 4 productos aleatorios de la lista obtenida de la API.
     */
    getRandomProducts() {
      if (this.allProducts.length === 0) {
        console.warn(" [getRandomProducts] No hay productos para seleccionar aleatoriamente.");
        return;
      }

      // Mezcla los productos aleatoriamente y selecciona los primeros 4
      const shuffled = [...this.allProducts].sort(() => 0.5 - Math.random());
      this.randomProducts = shuffled.slice(0, 4);
      console.log(" [getRandomProducts] Productos aleatorios seleccionados:", this.randomProducts);
    }
  }
});