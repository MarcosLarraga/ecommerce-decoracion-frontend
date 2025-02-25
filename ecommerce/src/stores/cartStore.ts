import { defineStore } from 'pinia';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[],
  }),

  getters: {
    cartTotal: (state) =>
      state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    addToCart(product: CartItem) {
      const existingItem = this.cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }

      this.saveCart();
    },

    removeFromCart(productId: number) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      this.saveCart();
    },

    clearCart() {
      this.cart = [];
      localStorage.removeItem('cart');
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
  },
});
