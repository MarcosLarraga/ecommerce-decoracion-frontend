import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as { id: number; name: string; price: number; quantity: number; image: string }[],
  }),

  getters: {
    totalItems: (state) => state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) => state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    addToCart(product: { id: number; name: string; price: number; image: string }) {
      const existingItem = this.cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart(productId: number) {
      const index = this.cart.findIndex((item) => item.id === productId);

      if (index !== -1) {
        if (this.cart[index].quantity > 1) {
          this.cart[index].quantity -= 1;
        } else {
          this.cart.splice(index, 1);
        }
      }
    },
  },
});
