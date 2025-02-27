import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

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
      const toast = useToast();
      const existingItem = this.cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
        // Solo notificación para el cliente cuando añade un producto nuevo
      } else {
        this.cart.push({ ...product, quantity: 1 });
        toast.success(`${product.name} añadido al carrito`);
      }

      this.saveCart();
    },

    decreaseQuantity(productId: number) {
      const existingItem = this.cart.find((item) => item.id === productId);
      
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        this.saveCart();
      }
    },

    removeFromCart(productId: number) {
      const product = this.cart.find(item => item.id === productId);
      
      if (product) {
        this.cart = this.cart.filter((item) => item.id !== productId);
        // Eliminamos la notificación
        this.saveCart();
      }
    },

    clearCart() {
      this.cart = [];
      localStorage.removeItem('cart');
      // Eliminamos la notificación de "Carrito vaciado correctamente"
      console.log("Carrito vaciado");
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
  },
});
