import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

// Definir la interfaz para una categoría
interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  route: string;
}

export const useCategoriesStore = defineStore('categories', () => {
  const allCategories = ref<Category[]>([]); // Lista de categorías

  // Función para obtener las categorías desde la API y asignar imágenes/rutas dinámicas
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5162/api/Categoria'); // ✅ Usa Axios para la petición
      const data = response.data; // ✅ Extrae los datos correctamente

      // Asignar imágenes y rutas dinámicamente
      allCategories.value = data.map((category: any) => ({
        id: category.id,
        name: category.nombre, // ✅ Ajuste de nombres según la API
        description: category.descripcion,
        image: `/fotos/${category.nombre.replace(/\s+/g, "_")}.jpg`, // ✅ Imagen con el mismo nombre que la categoría
        route: `/products?category=${category.nombre}` // ✅ Ruta dinámica
      }));

      console.log("Categorías procesadas:", allCategories.value);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  return { allCategories, fetchCategories };
});
