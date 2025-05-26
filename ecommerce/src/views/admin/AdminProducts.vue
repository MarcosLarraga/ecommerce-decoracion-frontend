<!-- @/views/admin/AdminProducts.vue -->
<template>
  <div class="admin-view admin-products">
    <AdminHeader title="Gestión de Productos">
      <template #actions>
        <AdminSearch v-model="searchQuery" placeholder="Buscar productos..." />
        <button class="header-btn" @click="createProduct">
          <i class="fas fa-box-open"></i>
          <span class="text">Añadir Producto</span>
        </button>
      </template>
    </AdminHeader>

    <!-- Filtro de proveedor activo -->
    <div v-if="currentProvider" class="filter-badge">
      <h2 class="filter-badge__title">
        Productos de <span class="filter-badge__name">{{ currentProvider.nombre }}</span>
      </h2>
      <router-link to="/admin/providers" class="filter-badge__back">
        <i class="fas fa-arrow-left"></i>
        Volver a proveedores
      </router-link>
    </div>

    <!-- Vista Mobile/Tablet (Tarjetas) -->
    <div class="admin-products__mobile-view">
      <!-- Filtros Mobile -->
      <div class="admin-products__filters">
        <div class="admin-products__filter-group">
          <label class="admin-products__filter-label">
            <i class="fas fa-tags"></i>
            Categoría
          </label>
          <AdminSelect v-model="categoryFilter">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.nombre }}
            </option>
          </AdminSelect>
        </div>

        <div v-if="!currentProvider" class="admin-products__filter-group">
          <label class="admin-products__filter-label">
            <i class="fas fa-building"></i>
            Proveedor
          </label>
          <AdminSelect v-model="providerFilter">
            <option value="">Todos los proveedores</option>
            <option v-for="provider in providers" :key="provider.id" :value="provider.id">
              {{ provider.nombre }}
            </option>
          </AdminSelect>
        </div>
      </div>

      <!-- Grid de productos -->
      <div class="admin-products__grid">
        <div v-for="product in filteredProducts" :key="product.id" class="admin-products__card">
          <!-- Header de la tarjeta -->
          <div class="admin-products__card-header">
            <div class="admin-products__card-info-section">
              <div class="admin-products__card-image">
                <img v-if="product.urlImagen" :src="product.urlImagen" :alt="product.nombre" />
                <div v-else class="admin-products__card-image-placeholder">
                  <i class="fas fa-box"></i>
                </div>
              </div>
              <div class="admin-products__card-id">#{{ product.id }}</div>
            </div>
            <div class="admin-products__card-actions">
              <button class="admin-products__action-btn admin-products__action-btn--edit" 
                      @click="editProduct(product)" 
                      title="Editar producto">
                <i class="fas fa-edit"></i>
              </button>
              <button class="admin-products__action-btn admin-products__action-btn--delete" 
                      @click="confirmDeleteProduct(product)" 
                      title="Eliminar producto">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="admin-products__card-content">
            <h3 class="admin-products__card-title">{{ product.nombre }}</h3>
            <div class="admin-products__card-price">{{ formatCurrency(product.precio) }}</div>
            
            <div class="admin-products__card-info">
              <div class="admin-products__info-item">
                <span class="admin-products__info-label">Categoría:</span>
                <span class="admin-products__info-value">{{ getCategoryName(product.categoriaId) }}</span>
              </div>
              <div class="admin-products__info-item">
                <span class="admin-products__info-label">Proveedor:</span>
                <span class="admin-products__info-value">{{ getProviderName(product.proveedorId) }}</span>
              </div>
              <div v-if="product.descripcion" class="admin-products__info-item admin-products__info-item--full">
                <span class="admin-products__info-label">Descripción:</span>
                <span class="admin-products__info-value">{{ product.descripcion }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredProducts.length === 0" class="admin-products__empty">
          <div class="admin-products__empty-icon">
            <i class="fas fa-box-open"></i>
          </div>
          <h3 class="admin-products__empty-title">
            {{ searchQuery || categoryFilter || providerFilter ? 'Sin resultados' : 'No hay productos' }}
          </h3>
          <p class="admin-products__empty-description">
            {{ searchQuery || categoryFilter || providerFilter ? 'No se encontraron productos con esos criterios' : 'No hay productos registrados' }}
          </p>
          <button class="admin-products__empty-btn" @click="createProduct">
            <i class="fas fa-plus"></i>
            Añadir producto
          </button>
        </div>
      </div>
    </div>

    <!-- Vista Desktop (Tabla) -->
    <div class="admin-products__desktop-view">
      <AdminContent>
        <template #filters>
          <AdminFilter label="Categoría:">
            <AdminSelect v-model="categoryFilter">
              <option value="">Todas las categorías</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.nombre }}
              </option>
            </AdminSelect>
          </AdminFilter>

          <AdminFilter v-if="!currentProvider" label="Proveedor:">
            <AdminSelect v-model="providerFilter">
              <option value="">Todos los proveedores</option>
              <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                {{ provider.nombre }}
              </option>
            </AdminSelect>
          </AdminFilter>
        </template>

        <AdminTable :columns="columns" :isEmpty="filteredProducts.length === 0"
          :emptyMessage="searchQuery || categoryFilter || providerFilter ? 'No se encontraron productos con esos criterios' : 'No hay productos registrados'">
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>#{{ product.id }}</td>
            <td>
              <div class="thumb-image">
                <img v-if="product.urlImagen" :src="product.urlImagen" :alt="product.nombre" />
                <div v-else class="thumb-image__placeholder">
                  <i class="fas fa-box"></i>
                </div>
              </div>
            </td>
            <td>{{ product.nombre }}</td>
            <td>{{ formatCurrency(product.precio) }}</td>
            <td>{{ getCategoryName(product.categoriaId) }}</td>
            <td>{{ getProviderName(product.proveedorId) }}</td>
            <td class="action-buttons">
              <button class="btn btn-edit" @click="editProduct(product)" title="Editar producto">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-delete" @click="confirmDeleteProduct(product)" title="Eliminar producto">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </AdminTable>
      </AdminContent>
    </div>

    <!-- Modal para crear/editar producto -->
    <AdminModal v-model="showProductModal" :title="isCreating ? 'Crear Producto' : 'Editar Producto'"
      v-if="editingProduct">
      <AdminForm @submit="saveProduct">
        <div class="admin-form__row">
          <div class="admin-form__col" v-if="!isCreating">
            <AdminFormGroup label="ID">
              <AdminInput :value="editingProduct.id" disabled />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="Nombre" required :error="validationErrors.nombre">
              <AdminInput v-model="editingProduct.nombre" :error="!!validationErrors.nombre" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Precio" required :error="validationErrors.precio">
              <AdminInput type="number" v-model.number="editingProduct.precio" step="0.01" min="0"
                :error="!!validationErrors.precio" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Categoría" required :error="validationErrors.categoriaId">
              <AdminSelect v-model="editingProduct.categoriaId" :error="!!validationErrors.categoriaId" required>
                <option value="">Seleccionar categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.nombre }}
                </option>
              </AdminSelect>
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Proveedor" required :error="validationErrors.proveedorId">
              <AdminSelect v-model="editingProduct.proveedorId" :error="!!validationErrors.proveedorId" required>
                <option value="">Seleccionar proveedor</option>
                <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                  {{ provider.nombre }}
                </option>
              </AdminSelect>
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="URL de Imagen">
              <AdminInput v-model="editingProduct.urlImagen" />

              <div v-if="editingProduct.urlImagen" class="admin-form__image-preview">
                <img :src="editingProduct.urlImagen" alt="Vista previa" />
              </div>
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="Descripción">
              <AdminTextarea v-model="editingProduct.descripcion" rows="4" />
            </AdminFormGroup>
          </div>
        </div>
      </AdminForm>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelEdit" :disabled="loading">
          <i class="fas fa-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="modal-btn primary-btn" @click="saveProduct" :disabled="loading">
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-save"></i>
          <span>{{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Producto' : 'Guardar Cambios') }}</span>
        </button>
      </template>
    </AdminModal>

    <!-- Modal de confirmación de eliminación -->
    <AdminModal v-model="showDeleteConfirmation" title="Confirmar Eliminación" size="sm" v-if="productToDelete">
      <div class="confirm-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>
          ¿Estás seguro de que deseas eliminar el producto
          <strong>{{ productToDelete.nombre }}</strong>?
          <br>
          Esta acción no se puede deshacer.
        </p>
      </div>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelDelete" :disabled="loading">
          <i class="fas fa-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="modal-btn error-btn" @click="deleteProduct" :disabled="loading">
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-trash-alt"></i>
          <span>{{ loading ? 'Eliminando...' : 'Eliminar Producto' }}</span>
        </button>
      </template>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router';

// Componentes
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSearch from '@/components/admin/AdminSearch.vue';
import AdminContent from '@/components/admin/AdminContent.vue';
import AdminFilter from '@/components/admin/AdminFilter.vue';
import AdminSelect from '@/components/admin/AdminSelect.vue';
import AdminTable from '@/components/admin/AdminTable.vue';
import AdminModal from '@/components/admin/AdminModal.vue';
import AdminForm from '@/components/admin/AdminForm.vue';
import AdminFormGroup from '@/components/admin/AdminFormGroup.vue';
import AdminInput from '@/components/admin/AdminInput.vue';
import AdminTextarea from '@/components/admin/AdminTextarea.vue';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoriaId: number;
  proveedorId: number;
  urlImagen: string;
  descripcion: string;
}

const adminStore = useAdminStore();
const toast = useToast();
const route = useRoute();

const searchQuery = ref('');
const categoryFilter = ref('');
const providerFilter = ref('');
const loading = ref(false);
const editingProduct = ref<Partial<Producto> | null>(null);
const productToDelete = ref<Producto | null>(null);
const validationErrors = ref<Record<string, string>>({});
const showProductModal = ref(false);
const showDeleteConfirmation = ref(false);

// Obtener el parámetro provider de la URL
const providerId = computed(() => {
  const providerParam = route.query.provider;
  return providerParam ? Number(providerParam) : null;
});

// Establecer el filtro de proveedor desde la URL si existe
watch(providerId, (id) => {
  if (id) {
    providerFilter.value = String(id);
  }
}, { immediate: true });

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Imagen', key: 'imagen' },
  { label: 'Nombre', key: 'nombre' },
  { label: 'Precio', key: 'precio' },
  { label: 'Categoría', key: 'categoria' },
  { label: 'Proveedor', key: 'proveedor' }
];

// Computed properties
const isCreating = computed(() => !editingProduct.value?.id);
const categories = computed(() => adminStore.categories);
const providers = computed(() => adminStore.providers);

// Obtener información del proveedor actual si viene de la página de proveedores
const currentProvider = computed(() => {
  if (!providerId.value) return null;
  return adminStore.providers.find(p => p.id === providerId.value);
});

const filteredProducts = computed(() => {
  let result = [...adminStore.products];
  
  // Buscar por texto
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(product => 
      product.nombre?.toLowerCase().includes(query) ||
      product.descripcion?.toLowerCase().includes(query) ||
      String(product.id).includes(query)
    );
  }
  
  // Filtrar por categoría
  if (categoryFilter.value) {
    result = result.filter(product => 
      product.categoriaId === Number(categoryFilter.value)
    );
  }
  
  // Filtrar por proveedor (desde URL o desde select)
  if (providerId.value || providerFilter.value) {
    const filterValue = providerId.value || Number(providerFilter.value);
    result = result.filter(product => 
      product.proveedorId === filterValue
    );
  }
  
  return result;
});

onMounted(async () => {
  loading.value = true;
  try {
    // Para asegurar que todos los datos necesarios estén cargados
    const loadPromises = [];
    
    if (adminStore.products.length === 0) {
      loadPromises.push(adminStore.fetchAllProducts());
    }
    
    if (adminStore.categories.length === 0) {
      loadPromises.push(adminStore.fetchAllCategories());
    }
    
    if (adminStore.providers.length === 0) {
      loadPromises.push(adminStore.fetchAllProviders());
    }
    
    await Promise.all(loadPromises);
  } catch (error) {
    console.error("Error al cargar datos:", error);
    toast.error("Error al cargar los datos. Por favor, intenta de nuevo.");
  } finally {
    loading.value = false;
  }
});

// Métodos
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

const getCategoryName = (categoryId: number) => {
  const category = adminStore.getCategoryById(categoryId);
  return category ? category.nombre : 'Sin categoría';
};

const getProviderName = (providerId: number | null) => {
  if (!providerId) return 'Sin proveedor';
  const provider = adminStore.getProviderById(providerId);
  return provider ? provider.nombre : 'Sin proveedor';
};

const validateProduct = (): boolean => {
  validationErrors.value = {};
  
  if (!editingProduct.value) return false;
  
  if (!editingProduct.value.nombre?.trim()) {
    validationErrors.value.nombre = 'El nombre es obligatorio';
  }
  
  if (!editingProduct.value.precio || editingProduct.value.precio <= 0) {
    validationErrors.value.precio = 'El precio debe ser mayor que cero';
  }
  
  if (!editingProduct.value.categoriaId) {
    validationErrors.value.categoriaId = 'Debes seleccionar una categoría';
  }
  
  if (!editingProduct.value.proveedorId) {
    validationErrors.value.proveedorId = 'Debes seleccionar un proveedor';
  }
  
  return Object.keys(validationErrors.value).length === 0;
};

const createProduct = () => {
  editingProduct.value = {
    nombre: '',
    precio: 0,
    categoriaId: '',
    proveedorId: providerId.value || '',
    urlImagen: '',
    descripcion: ''
  };
  showProductModal.value = true;
};

const editProduct = (product: Producto) => {
  editingProduct.value = { ...product };
  showProductModal.value = true;
};

const cancelEdit = () => {
  showProductModal.value = false;
  editingProduct.value = null;
  validationErrors.value = {};
};

const saveProduct = async () => {
  if (!editingProduct.value) return;
  
  if (!validateProduct()) {
    toast.error('Por favor, corrija los errores del formulario');
    return;
  }
  
  loading.value = true;
  try {
    if (isCreating.value) {
      await adminStore.createProduct(editingProduct.value as Omit<Producto, 'id'>);
      toast.success('Producto creado correctamente');
    } else {
      await adminStore.updateProduct(editingProduct.value as Producto);
      toast.success('Producto actualizado correctamente');
    }
    showProductModal.value = false;
    editingProduct.value = null;
  } catch (error: any) {
    toast.error(`Error: ${error.message || 'Ha ocurrido un error'}`);
  } finally {
    loading.value = false;
  }
};

const confirmDeleteProduct = (product: Producto) => {
  productToDelete.value = product;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  productToDelete.value = null;
};

const deleteProduct = async () => {
  if (!productToDelete.value) return;
  
  loading.value = true;
  try {
    await adminStore.deleteProduct(productToDelete.value.id);
    toast.success('Producto eliminado correctamente');
    showDeleteConfirmation.value = false;
    productToDelete.value = null;
  } catch (error: any) {
    toast.error(`Error: ${error.message || 'Ha ocurrido un error'}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/admin-unified-styles.scss';

.admin-products {
  // Vista mobile (por defecto visible)
  &__mobile-view {
    display: block;
    
    @media (min-width: $breakpoint-xl) {
      display: none;
    }
  }

  // Vista desktop (oculta en móvil/tablet)
  &__desktop-view {
    display: none;
    
    @media (min-width: $breakpoint-xl) {
      display: block;
    }
  }

  // Filtros mobile first
  &__filters {
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba($border-color, 0.2);
    padding: $spacing-md;
    margin: $spacing-md;
    margin-bottom: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    @media (min-width: $breakpoint-sm) {
      flex-direction: row;
      gap: $spacing-lg;
      padding: $spacing-lg;
      margin: $spacing-lg;
    }
  }

  &__filter-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;
    
    @media (min-width: $breakpoint-sm) {
      max-width: 250px;
    }
  }

  &__filter-label {
    font-size: $font-size-small;
    font-weight: $font-weight-semibold;
    color: $text-color;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    
    i {
      color: $primary-color;
      font-size: 12px;
    }
  }

  // Grid de productos mobile first
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    padding: $spacing-sm;
    justify-items: center;
    
    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: $spacing-lg;
      padding: $spacing-md;
    }
    
    @media (min-width: $breakpoint-lg) {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: $spacing-xl;
      padding: $spacing-lg;
    }
  }

  // Tarjetas de producto
  &__card {
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba($border-color, 0.3);
    overflow: hidden;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 400px;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }

    &-header {
      padding: $spacing-md;
      background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: $spacing-sm;
      
      @media (min-width: $breakpoint-sm) {
        padding: $spacing-lg;
        gap: $spacing-md;
      }
    }

    &-info-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-xs;
    }

    &-image {
      width: 60px;
      height: 60px;
      border-radius: $border-radius;
      overflow: hidden;
      border: 1px solid $border-color;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      
      @media (min-width: $breakpoint-sm) {
        width: 80px;
        height: 80px;
      }
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }

    &-image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: $text-color-secondary;
      font-size: 20px;
      
      @media (min-width: $breakpoint-sm) {
        font-size: 28px;
      }
    }

    &-id {
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      padding: 2px 6px;
      border-radius: $border-radius-sm;
      font-size: $font-size-small;
      font-weight: $font-weight-medium;
      align-self: flex-start;
      margin-top: $spacing-xs;
    }

    &-actions {
      display: flex;
      gap: $spacing-xs;
      flex-shrink: 0;
    }

    &-content {
      padding: $spacing-md;
      
      @media (min-width: $breakpoint-sm) {
        padding: $spacing-lg;
      }
    }

    &-title {
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;
      text-align: center;
      
      @media (min-width: $breakpoint-sm) {
        font-size: $font-size-xl;
      }
    }

    &-price {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $primary-color;
      text-align: center;
      margin-bottom: $spacing-md;
      
      @media (min-width: $breakpoint-sm) {
        font-size: $font-size-xxl;
      }
    }

    &-info {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }
  }

  // Botones de acción
  &__action-btn {
    width: 32px;
    height: 32px;
    border-radius: $border-radius-circle;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
    
    // Mejor área táctil en móvil
    @media (max-width: $breakpoint-sm - 1px) {
      width: 40px;
      height: 40px;
      font-size: 14px;
    }

    &--edit {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;

      &:hover {
        background-color: $primary-color;
        color: white;
        transform: scale(1.1);
      }
    }

    &--delete {
      background-color: rgba($error-color, 0.1);
      color: $error-color;

      &:hover {
        background-color: $error-color;
        color: white;
        transform: scale(1.1);
      }
    }
  }

  // Items de información
  &__info-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: $spacing-xs;
    background: rgba($tertiary-color, 0.5);
    border-radius: $border-radius-sm;
    
    &--full {
      grid-column: 1 / -1;
      
      .admin-products__info-value {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &__info-label {
    font-size: $font-size-small;
    font-weight: $font-weight-semibold;
    color: $text-color-secondary;
  }

  &__info-value {
    font-size: $font-size-base;
    color: $text-color;
    word-break: break-word;
  }

  // Estado vacío
  &__empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: $spacing-xl;
    background: white;
    border-radius: $border-radius-lg;
    border: 2px dashed rgba($primary-color, 0.2);
    max-width: 400px;
    margin: 0 auto;

    &-icon {
      width: 60px;
      height: 60px;
      background: rgba($primary-color, 0.1);
      border-radius: $border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-md;

      i {
        font-size: 24px;
        color: $primary-color;
      }
    }

    &-title {
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;
    }

    &-description {
      color: $text-color-secondary;
      margin: 0 0 $spacing-lg;
      line-height: 1.5;
    }

    &-btn {
      display: inline-flex;
      align-items: center;
      gap: $spacing-sm;
      background: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius;
      padding: $spacing-sm $spacing-md;
      font-weight: $font-weight-semibold;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: $primary-color-hover;
        transform: translateY(-2px);
      }

      i {
        font-size: 14px;
      }
    }
  }
}
</style>