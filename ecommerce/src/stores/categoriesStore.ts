import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';

interface Category {
  name: string;
  image: string;
}

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const categories = ref<Category[]>([]);

  const defaultCategories: Category[] = [
    { name: 'Textiles', image: '/fotos/textiles.jpg' },
    { name: 'Decoracion Vertical', image: '/fotos/Decoracion Vertical.jpg' },
    { name: 'Accesorio Decorativo', image: '/fotos/Accesorio Decorativo.jpg' }
  ];

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.example.com/categories');
      const data = await response.json();
      categories.value = data.length ? data : defaultCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      categories.value = defaultCategories;
    }
  };

  const allCategories = computed(() => categories.value);

  onMounted(fetchCategories);

  return {
    categories,
    allCategories,
    fetchCategories
  };
});
