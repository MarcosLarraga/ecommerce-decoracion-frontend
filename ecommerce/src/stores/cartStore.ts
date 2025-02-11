import { defineStore } from 'pinia';

export const useCartStore = defineStore('cartStore', {
  state: () => ({
    items: [] as any[],
  }),
  actions: {
    addToCart(product: any) {
      this.items.push(product);
    },
  },
});
