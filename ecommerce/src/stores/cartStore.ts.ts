import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
}

export const useCartStore = defineStore('cartStore', () => {
  const cart = ref<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    const item = cart.value.find((p) => p.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter((p) => p.id !== productId);
  };

  const totalItems = computed(() => cart.value.reduce((acc, item) => acc + item.quantity, 0));

  return {
    cart,
    addToCart,
    removeFromCart,
    totalItems
  };
});
