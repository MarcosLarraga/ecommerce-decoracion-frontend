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
        this.cart.splice(index, 1);
      }
    },

    // ✅ Método para aumentar la cantidad de un producto
    increaseQuantity(productId: number) {
      const product = this.cart.find((item) => item.id === productId);
      if (product) {
        product.quantity += 1;
      }
    },

    // ✅ Método para disminuir la cantidad de un producto
    decreaseQuantity(productId: number) {
      const product = this.cart.find((item) => item.id === productId);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
      }
    },
  },
});
