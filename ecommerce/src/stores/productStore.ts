import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get('https://tu-api.com/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});
