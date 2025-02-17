import { defineStore } from 'pinia';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    allCategories: [
      { id: 1, name: 'Textiles', image: '/fotos/textiles.jpg', route: '/category/textiles' },
      { id: 2, name: 'Decoración Vertical', image: '/fotos/Decoracion Vertical.jpg', route: '/category/decoracion-vertical' },
      { id: 3, name: 'Accesorio Decorativo', image: '/fotos/Accesorio Decorativo.jpg', route: '/category/accesorio-decorativo' }
    ]
  }),
  actions: {
    // Puedes agregar métodos para manejar categorías si es necesario
  }
});
