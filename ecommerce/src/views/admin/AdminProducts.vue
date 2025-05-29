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
    <div v-if="showProductModal" class="admin-products__modal-overlay" @click="handleOverlayClick">
      <div class="admin-products__modal" @click.stop>
        <div class="admin-products__modal-header">
          <h2 class="admin-products__modal-title">
            {{ isCreating ? 'Crear Producto' : 'Editar Producto' }}
          </h2>
          <button class="admin-products__modal-close" @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-products__modal-body">
          <form class="admin-products__form" @submit.prevent="saveProduct">
            <div class="admin-products__form-grid">
              <!-- Campo ID solo en edición -->
              <div v-if="!isCreating" class="admin-products__form-group">
                <label class="admin-products__form-label">ID</label>
                <input class="admin-products__form-input" :value="editingProduct?.id" disabled readonly />
              </div>

              <!-- Campo Nombre -->
              <div class="admin-products__form-group" :class="{ 'admin-products__form-group--full': isCreating }">
                <label class="admin-products__form-label">
                  Nombre <span class="admin-products__form-required">*</span>
                </label>
                <input v-model="editingProduct.nombre" class="admin-products__form-input"
                  :class="{ 'admin-products__form-input--error': validationErrors.nombre }"
                  placeholder="Nombre del producto" required />
                <div v-if="validationErrors.nombre" class="admin-products__form-error">
                  {{ validationErrors.nombre }}
                </div>
              </div>

              <!-- Campo Precio -->
              <div class="admin-products__form-group" :class="{ 'admin-products__form-group--full': isCreating }">
                <label class="admin-products__form-label">
                  Precio <span class="admin-products__form-required">*</span>
                </label>
                <input v-model.number="editingProduct.precio" type="number" step="0.01" min="0"
                  class="admin-products__form-input"
                  :class="{ 'admin-products__form-input--error': validationErrors.precio }"
                  placeholder="0.00" required />
                <div v-if="validationErrors.precio" class="admin-products__form-error">
                  {{ validationErrors.precio }}
                </div>
              </div>

              <!-- Campo Categoría -->
              <div class="admin-products__form-group">
                <label class="admin-products__form-label">
                  Categoría <span class="admin-products__form-required">*</span>
                </label>
                <select v-model="editingProduct.categoriaId" class="admin-products__form-select"
                  :class="{ 'admin-products__form-input--error': validationErrors.categoriaId }" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.nombre }}
                  </option>
                </select>
                <div v-if="validationErrors.categoriaId" class="admin-products__form-error">
                  {{ validationErrors.categoriaId }}
                </div>
              </div>

              <!-- Campo Proveedor -->
              <div class="admin-products__form-group">
                <label class="admin-products__form-label">
                  Proveedor <span class="admin-products__form-required">*</span>
                </label>
                <select v-model="editingProduct.proveedorId" class="admin-products__form-select"
                  :class="{ 'admin-products__form-input--error': validationErrors.proveedorId }" required>
                  <option value="">Seleccionar proveedor</option>
                  <option v-for="provider in providers" :key="provider.id" :value="provider.id">
                    {{ provider.nombre }}
                  </option>
                </select>
                <div v-if="validationErrors.proveedorId" class="admin-products__form-error">
                  {{ validationErrors.proveedorId }}
                </div>
              </div>

              <!-- Campo URL de Imagen -->
              <div class="admin-products__form-group admin-products__form-group--full">
                <label class="admin-products__form-label">URL de Imagen</label>
                <input v-model="editingProduct.urlImagen" type="url" class="admin-products__form-input"
                  placeholder="https://ejemplo.com/imagen.jpg" />
                
                <!-- Vista previa de imagen -->
                <div v-if="editingProduct.urlImagen" class="admin-products__form-image-preview">
                  <img :src="editingProduct.urlImagen" alt="Vista previa" />
                </div>
              </div>

              <!-- Campo Descripción -->
              <div class="admin-products__form-group admin-products__form-group--full">
                <label class="admin-products__form-label">Descripción</label>
                <textarea v-model="editingProduct.descripcion" class="admin-products__form-textarea" rows="4"
                  placeholder="Descripción detallada del producto"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="admin-products__modal-footer">
          <button class="admin-products__modal-btn admin-products__modal-btn--secondary" @click="cancelEdit"
            :disabled="loading">
            Cancelar
          </button>
          <button class="admin-products__modal-btn admin-products__modal-btn--primary" @click="saveProduct"
            :disabled="loading || !isFormValid">
            <i v-if="loading" class="admin-products__spinner"></i>
            {{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Producto' : 'Guardar Cambios') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteConfirmation" class="admin-products__modal-overlay" @click="cancelDelete">
      <div class="admin-products__modal admin-products__modal--small" @click.stop>
        <div class="admin-products__modal-header">
          <h2 class="admin-products__modal-title">Confirmar Eliminación</h2>
          <button class="admin-products__modal-close" @click="cancelDelete">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-products__modal-body">
          <div class="admin-products__confirm">
            <i class="fas fa-exclamation-triangle admin-products__confirm-icon"></i>
            <p class="admin-products__confirm-text">
              ¿Eliminar el producto <strong>{{ productToDelete?.nombre }}</strong>?
              <br>Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div class="admin-products__modal-footer">
          <button class="admin-products__modal-btn admin-products__modal-btn--secondary" @click="cancelDelete"
            :disabled="loading">
            Cancelar
          </button>
          <button class="admin-products__modal-btn admin-products__modal-btn--danger" @click="deleteProduct" :disabled="loading">
            <i v-if="loading" class="admin-products__spinner"></i>
            {{ loading ? 'Eliminando...' : 'Eliminar Producto' }}
          </button>
        </div>
      </div>
    </div>
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
const editingProduct = ref<Partial<Producto>>({
  nombre: '',
  precio: 0,
  categoriaId: '',
  proveedorId: '',
  urlImagen: '',
  descripcion: ''
});
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

const isFormValid = computed(() => {
  if (!editingProduct.value) return false;

  const hasName = editingProduct.value.nombre?.trim();
  const hasPrice = editingProduct.value.precio && editingProduct.value.precio > 0;
  const hasCategory = editingProduct.value.categoriaId;
  const hasProvider = editingProduct.value.proveedorId;

  return hasName && hasPrice && hasCategory && hasProvider && Object.keys(validationErrors.value).length === 0;
});

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

// Watchers para validación en tiempo real
watch(() => editingProduct.value.nombre, (newValue) => {
  if (validationErrors.value.nombre && newValue?.trim()) {
    delete validationErrors.value.nombre;
  }
});

watch(() => editingProduct.value.precio, (newValue) => {
  if (validationErrors.value.precio && newValue && newValue > 0) {
    delete validationErrors.value.precio;
  }
});

watch(() => editingProduct.value.categoriaId, (newValue) => {
  if (validationErrors.value.categoriaId && newValue) {
    delete validationErrors.value.categoriaId;
  }
});

watch(() => editingProduct.value.proveedorId, (newValue) => {
  if (validationErrors.value.proveedorId && newValue) {
    delete validationErrors.value.proveedorId;
  }
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

const resetForm = () => {
  editingProduct.value = {
    nombre: '',
    precio: 0,
    categoriaId: '',
    proveedorId: providerId.value || '',
    urlImagen: '',
    descripcion: ''
  };
  validationErrors.value = {};
};

const createProduct = () => {
  console.log('Creando nuevo producto...');
  resetForm();
  showProductModal.value = true;
};

const editProduct = (product: Producto) => {
  console.log('Editando producto:', product);
  
  // Crear una copia profunda del producto
  editingProduct.value = {
    id: product.id,
    nombre: product.nombre || '',
    precio: product.precio || 0,
    categoriaId: product.categoriaId || '',
    proveedorId: product.proveedorId || '',
    urlImagen: product.urlImagen || '',
    descripcion: product.descripcion || ''
  };
  
  validationErrors.value = {};
  showProductModal.value = true;
  
  console.log('Producto para editar:', editingProduct.value);
};

const handleOverlayClick = () => {
  cancelEdit();
};

const cancelEdit = () => {
  console.log('Cancelando edición...');
  showProductModal.value = false;
  resetForm();
};

const saveProduct = async () => {
  console.log('Guardando producto...', editingProduct.value);
  
  if (!editingProduct.value) {
    toast.error('No hay datos de producto para guardar');
    return;
  }
  
  if (!validateProduct()) {
    toast.error('Por favor, corrija los errores del formulario');
    return;
  }
  
  loading.value = true;
  try {
    if (isCreating.value) {
      // Crear nuevo producto
      console.log('Creando producto:', editingProduct.value);
      
      const productData = {
        nombre: editingProduct.value.nombre.trim(),
        precio: editingProduct.value.precio,
        categoriaId: Number(editingProduct.value.categoriaId),
        proveedorId: Number(editingProduct.value.proveedorId),
        urlImagen: editingProduct.value.urlImagen?.trim() || '',
        descripcion: editingProduct.value.descripcion?.trim() || ''
      };
      
      await adminStore.createProduct(productData);
      
      // Recargar todos los productos después de crear
      console.log('Recargando lista de productos después de crear...');
      await adminStore.fetchAllProducts();
      
      toast.success('Producto creado correctamente');
    } else {
      // Actualizar producto existente
      console.log('Actualizando producto:', editingProduct.value);
      
      const productData = {
        id: editingProduct.value.id!,
        nombre: editingProduct.value.nombre.trim(),
        precio: editingProduct.value.precio,
        categoriaId: Number(editingProduct.value.categoriaId),
        proveedorId: Number(editingProduct.value.proveedorId),
        urlImagen: editingProduct.value.urlImagen?.trim() || '',
        descripcion: editingProduct.value.descripcion?.trim() || ''
      };
      
      await adminStore.updateProduct(productData);
      
      // Recargar todos los productos para asegurar sincronización
      console.log('Recargando lista de productos...');
      await adminStore.fetchAllProducts();
      
      toast.success('Producto actualizado correctamente');
    }
    
    // Cerrar modal y limpiar formulario
    showProductModal.value = false;
    resetForm();
    
    console.log('Operación completada. Total productos:', adminStore.products.length);
    
  } catch (error: any) {
    console.error('Error al guardar producto:', error);
    toast.error(error.message || 'Error al guardar producto');
  } finally {
    loading.value = false;
  }
};

const confirmDeleteProduct = (product: Producto) => {
  console.log('Confirmando eliminación de producto:', product);
  productToDelete.value = product;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  console.log('Cancelando eliminación');
  showDeleteConfirmation.value = false;
  productToDelete.value = null;
};

const deleteProduct = async () => {
  console.log('Eliminando producto...', productToDelete.value);
  
  if (!productToDelete.value?.id) {
    toast.error('No hay producto seleccionado para eliminar');
    return;
  }

  loading.value = true;

  try {
    await adminStore.deleteProduct(productToDelete.value.id);
    
    // Recargar todos los productos después de eliminar
    console.log('Recargando lista de productos después de eliminar...');
    await adminStore.fetchAllProducts();
    
    toast.success('Producto eliminado correctamente');
    showDeleteConfirmation.value = false;
    productToDelete.value = null;
    
    console.log('Eliminación completada. Total productos:', adminStore.products.length);
    
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    toast.error(error.message || 'Error al eliminar producto');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-products {
  // Base móvil
  padding: $spacing-sm;
  min-height: 100vh;
  background-color: $tertiary-color;
  
  @media (min-width: $breakpoint-sm) {
    padding: $spacing-md;
  }
  
  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }

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

  &__info-item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-xs;
    font-size: $font-size-small;
    
    &--full {
      flex-direction: column;
      gap: $spacing-xs;
    }
  }

  &__info-label {
    font-weight: $font-weight-semibold;
    color: $text-color-secondary;
    min-width: 80px;
    flex-shrink: 0;
  }

  &__info-value {
    color: $text-color;
    word-break: break-word;
  }

  // Estado vacío
  &__empty {
    text-align: center;
    padding: $spacing-xl;
    color: $text-color-secondary;
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
    grid-column: 1 / -1;
    
    &-icon {
      font-size: 4rem;
      margin-bottom: $spacing-md;
      opacity: 0.5;
      
      i {
        color: $text-color-tertiary;
      }
    }
    
    &-title {
      font-size: $font-size-large;
      font-weight: $font-weight-semibold;
      margin: 0 0 $spacing-sm;
      color: $text-color;
    }
    
    &-description {
      margin: 0 0 $spacing-lg;
      color: $text-color-secondary;
    }
    
    &-btn {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-sm $spacing-md;
      background: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius;
      cursor: pointer;
      font-weight: $font-weight-medium;
      transition: all $transition-fast;
      
      &:hover {
        background: $primary-color-hover;
        transform: translateY(-1px);
      }
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

  // Modal
  &__modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: $z-index-modal;
    padding: $spacing-md;
    backdrop-filter: blur(2px);
  }

  &__modal {
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow-xl;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalFadeIn 0.3s ease;
    
    &--small {
      max-width: 400px;
    }
  }

  &__modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg;
    border-bottom: 1px solid $tertiary-color;
    background: white;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  &__modal-title {
    font-size: $font-size-large;
    font-weight: $font-weight-semibold;
    margin: 0;
    color: $text-color;
  }

  &__modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: $border-radius;
    cursor: pointer;
    color: $text-color-secondary;
    transition: all $transition-fast;
    
    &:hover {
      background: $tertiary-color;
      color: $text-color;
    }
  }

  &__modal-body {
    padding: $spacing-lg;
    background: white;
  }

  &__modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-md;
    padding: $spacing-lg;
    border-top: 1px solid $tertiary-color;
    background: white;
    position: sticky;
    bottom: 0;
  }

  // Form
  &__form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    
    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    
    &--full {
      @media (min-width: $breakpoint-sm) {
        grid-column: 1 / -1;
      }
    }
  }

  &__form-label {
    font-weight: $font-weight-medium;
    color: $text-color;
    font-size: $font-size-small;
    margin-bottom: $spacing-xs;
  }

  &__form-required {
    color: $error-color;
  }

  &__form-input,
  &__form-select,
  &__form-textarea {
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    font-size: $font-size-base;
    transition: border-color $transition-fast, box-shadow $transition-fast;
    
    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }
    
    &::placeholder {
      color: $text-color-tertiary;
    }
    
    &--error {
      border-color: $error-color;
      
      &:focus {
        border-color: $error-color;
        box-shadow: 0 0 0 2px rgba($error-color, 0.2);
      }
    }
    
    &:disabled,
    &[readonly] {
      background: $tertiary-color;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  &__form-select {
    cursor: pointer;
    
    &:disabled {
      cursor: not-allowed;
    }
  }

  &__form-textarea {
    resize: vertical;
    font-family: inherit;
    min-height: 100px;
  }

  &__form-error {
    color: $error-color;
    font-size: $font-size-small;
    margin-top: $spacing-xs;
  }

  &__form-image-preview {
    margin-top: $spacing-sm;
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background: $tertiary-color;
    text-align: center;
    
    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      border-radius: $border-radius-sm;
    }
  }

  // Modal buttons
  &__modal-btn {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-md;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    font-weight: $font-weight-medium;
    transition: all $transition-fast;
    min-width: 100px;
    justify-content: center;
    
    &--primary {
      background: $primary-color;
      color: white;
      
      &:hover:not(:disabled) {
        background: $primary-color-hover;
        transform: translateY(-1px);
      }
    }
    
    &--secondary {
      background: $tertiary-color;
      color: $text-color;
      border: 1px solid $border-color;
      
      &:hover:not(:disabled) {
        background: $tertiary-color-hover;
      }
    }
    
    &--danger {
      background: $error-color;
      color: white;
      
      &:hover:not(:disabled) {
        background: $error-color-hover;
        transform: translateY(-1px);
      }
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }
  }

  // Confirm dialog
  &__confirm {
    text-align: center;
    padding: $spacing-md 0;
  }

  &__confirm-icon {
    font-size: 3rem;
    color: $warning-color;
    margin-bottom: $spacing-md;
  }

  &__confirm-text {
    color: $text-color;
    line-height: 1.5;
    margin: 0;
    
    strong {
      color: $text-color;
      font-weight: $font-weight-semibold;
    }
  }

  // Spinner
  &__spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
    
    .admin-products__modal-btn--secondary & {
      border: 2px solid rgba($text-color, 0.3);
      border-top-color: $text-color;
    }
  }

  // Animation keyframes
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }} </style>