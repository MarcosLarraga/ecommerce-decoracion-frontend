<template>
  <div class="shop">
    <PageHero title="Descubre Nuestros Productos" imageSrc="/fotos/PageHero.jpg" />

    <!-- Filtros -->
    <div class="shop__filters">
      <div class="filters-container">
        <div class="shop__filter">
          <label for="categorySelect" class="shop__filter-label">
            <i class="fas fa-tags"></i>
            Categoría
          </label>
          <div class="custom-select">
            <select
              id="categorySelect"
              v-model="selectedCategory"
              class="shop__filter-select"
            >
              <option value="Todas">Todas las categorías</option>
              <option
                v-for="category in categoriesStore.allCategories"
                :key="category.id"
                :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>
            <i class="fas fa-chevron-down select-arrow"></i>
          </div>
        </div>

        <!-- Filtro de precio con slider -->
        <div class="shop__filter shop__filter--price">
          <label class="shop__filter-label">
            <i class="fas fa-euro-sign"></i>
            Precio: <span class="price-range">{{ priceRange[0] }}€ - {{ priceRange[1] }}€</span>
          </label>
          <div class="shop__price-slider-container">
            <div class="shop__price-slider-track"></div>
            <div class="shop__price-slider-progress" :style="progressStyle"></div>
            <input 
              type="range" 
              v-model.number="priceRange[0]" 
              :min="productsStore.minProductPrice" 
              :max="productsStore.maxProductPrice"
              class="shop__price-slider shop__price-slider--min"
              @input="validatePriceRange"
            />
            <input 
              type="range" 
              v-model.number="priceRange[1]" 
              :min="productsStore.minProductPrice" 
              :max="productsStore.maxProductPrice"
              class="shop__price-slider shop__price-slider--max"
              @input="validatePriceRange"
            />
          </div>
          <div class="shop__price-labels">
            <span>{{ productsStore.minProductPrice }}€</span>
            <span>{{ productsStore.maxProductPrice }}€</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de "sin resultados" -->
    <div v-if="filteredProducts.length === 0" class="no-results">
      <div class="no-results__icon">
        <i class="fas fa-search"></i>
      </div>
      <h3 class="no-results__title">No se encontraron productos</h3>
      <p class="no-results__message">Prueba ajustando los filtros para encontrar lo que buscas</p>
      <button class="no-results__reset" @click="resetFilters">
        <i class="fas fa-refresh"></i>
        Restablecer filtros
      </button>
    </div>

    <!-- Lista de productos -->
    <div v-else class="products-section">
      <div class="products-header">
        <div class="products-count">
          <i class="fas fa-box-open"></i>
          <span>{{ filteredProducts.length }} productos encontrados</span>
        </div>
      </div>
      
      <div class="products-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-wrapper">
          <ProductCard :producto="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '../stores/productsStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import ProductCard from '../components/ProductCard.vue';
import PageHero from '../components/PageHero.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const route = useRoute();
const router = useRouter();

const selectedCategory = ref<string>('Todas');

// Rango de precio seleccionado [min, max]
const priceRange = ref<[number, number]>([0, 1000]);

// Estilo dinámico para la barra de progreso del slider de precio
const progressStyle = computed(() => {
  const min = ((priceRange.value[0] - productsStore.minProductPrice) / 
               (productsStore.maxProductPrice - productsStore.minProductPrice)) * 100;
  const max = ((priceRange.value[1] - productsStore.minProductPrice) / 
               (productsStore.maxProductPrice - productsStore.minProductPrice)) * 100;
  return {
    left: `${min}%`,
    width: `${max - min}%`
  };
});

// Validar que el rango mínimo no sea mayor que el máximo
const validatePriceRange = () => {
  if (priceRange.value[0] > priceRange.value[1]) {
    priceRange.value[0] = priceRange.value[1];
  }
  updateUrlWithFilters();
};

// Restablecer filtros
const resetFilters = () => {
  selectedCategory.value = 'Todas';
  priceRange.value = [productsStore.minProductPrice, productsStore.maxProductPrice];
  updateUrlWithFilters();
};

// Actualizar la URL con los filtros aplicados (categoría y precio)
const updateUrlWithFilters = () => {
  const query = { ...route.query };

  // Actualizar categoría
  if (selectedCategory.value !== 'Todas') {
    query.category = selectedCategory.value;
  } else {
    delete query.category;
  }

  // Actualizar rango de precios
  if (priceRange.value[0] > productsStore.minProductPrice) {
    query.minPrice = priceRange.value[0].toString();
  } else {
    delete query.minPrice;
  }
  
  if (priceRange.value[1] < productsStore.maxProductPrice) {
    query.maxPrice = priceRange.value[1].toString();
  } else {
    delete query.maxPrice;
  }

  // Actualizar URL sin cambiar la ruta (sin router)
  const newUrl = new URL(window.location);
  newUrl.search = new URLSearchParams(query).toString();
  window.history.replaceState({}, '', newUrl);
};

// Función para realizar la búsqueda según el query "search"
const fetchProducts = async () => {
  const searchParam = route.query.search ? String(route.query.search) : '';
  if (searchParam) {
    await productsStore.searchProducts(searchParam);
  } else {
    await productsStore.fetchProducts();
  }
};

// Al montar el componente
onMounted(async () => {
  await categoriesStore.fetchCategories();
  // Realizar la búsqueda (si hay query search, se filtra; sino, carga todos)
  await fetchProducts();

  // Inicializar el rango de precios con los valores calculados en el store
  priceRange.value = [
    productsStore.minProductPrice,
    productsStore.maxProductPrice
  ];

  // Si en la URL hay filtros de categoría o precio, los aplicamos
  if (route.query.category) {
    selectedCategory.value = String(route.query.category);
  }
  if (route.query.minPrice) {
    priceRange.value[0] = Number(route.query.minPrice);
  }
  if (route.query.maxPrice) {
    priceRange.value[1] = Number(route.query.maxPrice);
  }
});

// Detectar cambios en el query de búsqueda y actualizar los productos
watch(
  () => route.query.search,
  async () => {
    await fetchProducts();
  }
);

// Watch para cambios en la categoría seleccionada y actualizar la URL
watch(selectedCategory, () => {
  updateUrlWithFilters();
});

// Computed: filtra los productos según la categoría y el rango de precio
const filteredProducts = computed(() => {
  let products = productsStore.allProducts;

  // Filtrar por categoría
  if (selectedCategory.value !== 'Todas') {
    const cat = categoriesStore.allCategories.find(
      (category) => category.name === selectedCategory.value
    );
    if (cat) {
      products = products.filter(
        (product) => product.categoriaId === cat.id
      );
    }
  }

  // Filtrar por rango de precio
  products = products.filter(product =>
    product.precio >= priceRange.value[0] &&
    product.precio <= priceRange.value[1]
  );

  return products;
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.shop {
  width: 100%;
  min-height: 100vh;
}

.shop__filters {
  margin: $spacing-xl auto;
  display: flex;
  justify-content: center;
  padding: 0 $spacing-sm;

  @media (min-width: $breakpoint-md) {
    margin: $spacing-xxl auto;
    padding: 0 $spacing-lg;
  }
}

.filters-container {
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba($border-color, 0.2);
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  width: 100%;
  max-width: 600px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $primary-color 0%, #059447 100%);
    border-radius: $border-radius-lg $border-radius-lg 0 0;
  }

  @media (min-width: $breakpoint-md) {
    flex-direction: row;
    align-items: flex-start;
    gap: $spacing-xl;
    padding: $spacing-xl;
  }
}

.shop__filter {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  width: 100%;

  @media (min-width: $breakpoint-md) {
    max-width: 250px;
    min-height: 120px;
  }

  &-label {
    font-size: $font-size-small;
    font-weight: $font-weight-semibold;
    color: $text-color;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    height: 20px;

    i {
      color: $primary-color;
      font-size: 14px;
    }

    .price-range {
      color: $primary-color;
      font-weight: $font-weight-bold;
      text-transform: none;
      letter-spacing: normal;
    }
  }
}

.custom-select {
  position: relative;
  height: 44px;

  .select-arrow {
    position: absolute;
    right: $spacing-sm;
    top: 50%;
    transform: translateY(-50%);
    color: $text-color-secondary;
    pointer-events: none;
    font-size: 12px;
    margin-top: 10px;
  }
}

.shop__filter-select {
  padding: $spacing-sm $spacing-xl $spacing-sm $spacing-sm;
  font-size: $font-size-base;
  border: 2px solid rgba($border-color, 0.3);
  border-radius: $border-radius;
  cursor: pointer;
  width: 100%;
  height: 44px;
  background: white;
  color: $text-color;
  appearance: none;
  transition: all 0.3s ease;
  font-weight: $font-weight-medium;
  margin-top: 10px;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
  }

  &:hover {
    border-color: rgba($primary-color, 0.5);
  }
}

.shop__filter--price {
  justify-content: space-between;
  
  .shop__price-slider-container {
    position: relative;
    width: 100%;
    height: 40px;
    margin: $spacing-sm 0;
    display: flex;
    align-items: center;
  }

  .shop__price-slider {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 6px;
    background: none;
    pointer-events: none;
    -webkit-appearance: none;
    z-index: 3;
    transform: translateY(-50%);
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 3px 8px rgba($primary-color, 0.3);
      border: 3px solid white;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 5px 15px rgba($primary-color, 0.4);
      }
    }
    
    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
      cursor: pointer;
      pointer-events: auto;
      border: 3px solid white;
      box-shadow: 0 3px 8px rgba($primary-color, 0.3);
    }
  }

  .shop__price-slider-track {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 6px;
    width: 100%;
    background: linear-gradient(90deg, #e9ecef 0%, #dee2e6 100%);
    border-radius: 6px;
    z-index: 1;
  }

  .shop__price-slider-progress {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 6px;
    background: linear-gradient(90deg, $primary-color 0%, #059447 100%);
    border-radius: 6px;
    z-index: 2;
    box-shadow: 0 2px 4px rgba($primary-color, 0.2);
  }

  .shop__price-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: $font-size-small;
    color: $text-color-secondary;
    font-weight: $font-weight-medium;
    margin-top: $spacing-xs;
  }
}

.no-results {
  text-align: center;
  padding: $spacing-xxl;
  background: white;
  border-radius: $border-radius-lg;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba($border-color, 0.2);
  max-width: 500px;
  margin: $spacing-xl auto;

  &__icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-color, 0.05) 100%);
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $spacing-lg;

    i {
      font-size: 32px;
      color: rgba($primary-color, 0.6);
    }
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $text-color;
    margin: 0 0 $spacing-sm;
  }

  &__message {
    color: $text-color-secondary;
    margin: 0 0 $spacing-lg;
    line-height: 1.5;
  }

  &__reset {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
    color: white;
    border: none;
    border-radius: $border-radius;
    padding: $spacing-sm $spacing-lg;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba($primary-color, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($primary-color, 0.4);
    }
  }
}

.products-section {
  padding: 0 $spacing-sm;
  max-width: 1400px;
  margin: 0 auto $spacing-xxl auto; // Añadido margen inferior
  
  @media (min-width: $breakpoint-md) {
    padding: 0 $spacing-lg;
    margin: 0 auto $spacing-xxl auto; // Margen inferior en desktop también
  }

  .products-header {
    display: flex;
    justify-content: center;
    margin-bottom: $spacing-lg;

    @media (min-width: $breakpoint-md) {
      margin-bottom: $spacing-xl;
    }
  }

  .products-count {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    background: white;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba($border-color, 0.2);
    color: $text-color-secondary;
    font-weight: $font-weight-medium;
    font-size: $font-size-small;

    i {
      color: $primary-color;
      font-size: 16px;
    }
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: $spacing-sm;
  justify-items: center;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 $spacing-xs;

  @media (min-width: $breakpoint-sm) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-md;
    padding: 0 $spacing-sm;
  }

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: $spacing-lg;
    padding: 0 $spacing-md;
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: $spacing-lg;
    padding: 0 $spacing-md;
  }
}

.product-wrapper {
  width: 100%;
  
}
</style>