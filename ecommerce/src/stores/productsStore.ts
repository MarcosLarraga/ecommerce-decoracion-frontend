import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';

interface Product {
  id: number;
  name: string;
  image: string;
  price: string;
}

export const useProductsStore = defineStore('productsStore', () => {
  const products = ref<Product[]>([]);

  const defaultProducts: Product[] = [
    { id: 1, name: 'Ejemplo Producto 1', image: '/fotos/default1.jpg', price: '€19.99' },
    { id: 2, name: 'Ejemplo Producto 2', image: '/fotos/default2.jpg', price: '€29.99' },
    { id: 3, name: 'Ejemplo Producto 3', image: '/fotos/default3.jpg', price: '€39.99' },
    { id: 4, name: 'Ejemplo Producto 4', image: '/fotos/default4.jpg', price: '€49.99' }
  ];

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.example.com/products');
      const data = await response.json();
      products.value = data.length ? data : defaultProducts;
    } catch (error) {
      console.error('Error fetching products:', error);
      products.value = defaultProducts;
    }
  };

  const allProducts = computed(() => products.value);

  onMounted(fetchProducts);

  return {
    products,
    allProducts,
    fetchProducts
  };
});
