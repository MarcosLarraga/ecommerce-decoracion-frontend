<!-- @/views/admin/AdminProducts.vue con botones nativos y mobile first -->
<template>
  <div class="admin-products">
    <AdminHeader title="Gestión de Productos">
      <template #actions>
        <AdminSearch v-model="searchQuery" placeholder="Buscar productos..." />
        <button class="header-btn" @click="createProduct">
          <span class="icon">➕</span>
          <span class="text">Añadir Producto</span>
        </button>
      </template>
    </AdminHeader>

    <!-- Filtro de proveedor activo -->
    <div v-if="currentProvider" class="provider-filter">
      <h2 class="provider-filter__title">
        Productos de <span class="provider-filter__name">{{ currentProvider.nombre }}</span>
      </h2>
      <router-link to="/admin/providers" class="provider-filter__back">
        <span class="arrow">←</span> Volver a proveedores
      </router-link>
    </div>

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
            <div class="product-image">
              <img v-if="product.urlImagen" :src="product.urlImagen" :alt="product.nombre" />
              <div v-else class="product-image__placeholder">
                📦
              </div>
            </div>
          </td>
          <td>{{ product.nombre }}</td>
          <td>{{ formatCurrency(product.precio) }}</td>
          <td>{{ getCategoryName(product.categoriaId) }}</td>
          <td>{{ getProviderName(product.proveedorId) }}</td>
          <td class="action-buttons">
            <button class="btn-edit" @click="editProduct(product)" title="Editar producto">
              ✏️
            </button>
            <button class="btn-delete" @click="confirmDeleteProduct(product)" title="Eliminar producto">
              🗑️
            </button>
          </td>
        </tr>
      </AdminTable>
    </AdminContent>

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
          Cancelar
        </button>
        <button class="modal-btn primary-btn" @click="saveProduct" :disabled="loading">
          {{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Producto' : 'Guardar Cambios') }}
        </button>
      </template>
    </AdminModal>

    <!-- Modal de confirmación de eliminación -->
    <AdminModal v-model="showDeleteConfirmation" title="Confirmar Eliminación" size="sm" v-if="productToDelete">
      <p class="admin-modal__message">
        ¿Estás seguro de que deseas eliminar el producto
        <strong>{{ productToDelete.nombre }}</strong>?
        <br>
        Esta acción no se puede deshacer.
      </p>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelDelete" :disabled="loading">
          Cancelar
        </button>
        <button class="modal-btn error-btn" @click="deleteProduct" :disabled="loading">
          {{ loading ? 'Eliminando...' : 'Eliminar Producto' }}
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
    toast.error('Por favor, corrige los errores del formulario');
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
@use '@/styles/mixins' as *;

.admin-products {
  width: 100%;
}

// Filtro de proveedor activo
.provider-filter {
  background-color: rgba($primary-color, 0.05);
  border-radius: $border-radius;
  padding: $spacing-md;
  margin: $spacing-md 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  
  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: $spacing-md 0 $spacing-lg;
  }
  
  &__title {
    margin: 0;
    font-size: $font-size-base;
    
    @media (min-width: $breakpoint-sm) {
      font-size: $font-size-large;
    }
  }
  
  &__name {
    color: $primary-color;
    font-weight: $font-weight-semibold;
  }
  
  &__back {
    color: $primary-color;
    text-decoration: none;
    font-weight: $font-weight-medium;
    display: flex;
    align-items: center;
    
    .arrow {
      margin-right: $spacing-xs;
      transition: transform $transition-fast;
    }
    
    &:hover .arrow {
      transform: translateX(-3px);
    }
  }
}

// Botón de acción en el header
.header-btn {
  display: flex;
  align-items: center;
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: $border-radius;
  padding: 0 $spacing-sm;
  height: 36px;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-fast;
  
  .icon {
    margin-right: $spacing-xs;
    font-size: 14px;
  }
  
  .text {
    display: none; // Ocultar texto en móviles
  }
  
  &:hover {
    background-color: $primary-color-hover;
  }
  
  @media (min-width: $breakpoint-sm) {
    padding: 0 $spacing-md;
    height: 40px;
    
    .text {
      display: inline; // Mostrar texto en tablets y escritorio
    }
    
    .icon {
      font-size: 16px;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    }
  }
}

// Botones de acción en la tabla
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-xs;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: $border-radius-sm;
    border: none;
    cursor: pointer;
    transition: all $transition-fast;
    font-size: 14px;
    
    @media (min-width: $breakpoint-sm) {
      width: 32px;
      height: 32px;
      border-radius: $border-radius-md;
      font-size: 16px;
    }
  }
  
  .btn-edit {
    background-color: $primary-color;
    color: white;
    
    &:hover {
      background-color: $primary-color-hover;
    }
    
    @media (min-width: $breakpoint-sm) {
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .btn-delete {
    background-color: $error-color;
    color: white;
    
    &:hover {
      background-color: $error-color-hover;
    }
    
    @media (min-width: $breakpoint-sm) {
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// Imagen del producto en la tabla
.product-image {
  width: 50px;
  height: 50px;
  border-radius: $border-radius;
  overflow: hidden;
  border: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: $breakpoint-sm) {
    width: 60px;
    height: 60px;
  }
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $tertiary-color;
    color: $text-color-secondary;
    font-size: 20px;
    
    @media (min-width: $breakpoint-sm) {
      font-size: 24px;
    }
  }
}

// Formulario
.admin-form {
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    
    @media (min-width: $breakpoint-sm) {
      gap: $spacing-md;
    }
  }
  
  &__col {
    flex: 1;
    min-width: 100%;
    
    @media (min-width: $breakpoint-sm) {
      min-width: 250px;
    }
    
    &--full {
      width: 100%;
      flex-basis: 100%;
    }
  }
  
  &__image-preview {
    margin-top: $spacing-sm;
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background-color: $tertiary-color;
    text-align: center;
    
    @media (min-width: $breakpoint-sm) {
      padding: $spacing-md;
    }
    
    img {
      max-width: 100%;
      max-height: 150px;
      object-fit: contain;
      
      @media (min-width: $breakpoint-sm) {
        max-height: 200px;
      }
    }
  }
}

// Botones en los modales
.modal-btn {
  padding: 6px 12px;
  border-radius: $border-radius;
  border: none;
  font-weight: $font-weight-medium;
  font-size: $font-size-small;
  cursor: pointer;
  transition: all $transition-fast;
  
  @media (min-width: $breakpoint-sm) {
    padding: 8px 16px;
    font-size: $font-size-base;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.primary-btn {
    background-color: $primary-color;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
    }
  }
  
  &.secondary-btn {
    background-color: $tertiary-color;
    color: $text-color;
    border: 1px solid $border-color;
    
    &:hover:not(:disabled) {
      background-color: $tertiary-color-hover;
    }
  }
  
  &.error-btn {
    background-color: $error-color;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: $error-color-hover;
    }
  }
}

// Mensajes en los modales
.admin-modal {
  &__message {
    margin-bottom: $spacing-md;
    line-height: 1.5;
  }
}
</style>