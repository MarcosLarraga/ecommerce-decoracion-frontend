<!-- @/views/admin/AdminProviders.vue -->
<template>
  <div class="admin-view admin-providers">
    <AdminHeader title="Gestión de Proveedores">
      <template #actions>
        <AdminSearch v-model="searchQuery" placeholder="Buscar proveedores..." />
        <button class="header-btn" @click="createProvider">
          <i class="fas fa-building"></i>
          <span class="text">Añadir Proveedor</span>
        </button>
      </template>
    </AdminHeader>

    <div class="providers-container">
      <div class="providers-grid">
        <div v-for="provider in filteredProviders" :key="provider.id" class="provider-card">
          <!-- Header de la tarjeta -->
          <div class="provider-card__header">
            <div class="provider-card__icon">
              <i class="fas fa-building"></i>
            </div>
            <h3 class="provider-card__title">{{ provider.nombre }}</h3>
            <div class="provider-card__actions">
              <button class="action-btn action-btn--edit" @click="editProvider(provider)" title="Editar proveedor">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn action-btn--delete" @click="confirmDeleteProvider(provider)" title="Eliminar proveedor">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>

          <!-- Contenido principal -->
          <div class="provider-card__content">
            <div class="provider-info">
              <div class="provider-info__item">
                <div class="provider-info__icon">
                  <i class="fas fa-id-card"></i>
                </div>
                <div class="provider-info__details">
                  <span class="provider-info__label">NIF</span>
                  <span class="provider-info__value">{{ provider.nif }}</span>
                </div>
              </div>

              <div class="provider-info__item">
                <div class="provider-info__icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="provider-info__details">
                  <span class="provider-info__label">Email</span>
                  <span class="provider-info__value">{{ provider.email }}</span>
                </div>
              </div>

              <div class="provider-info__item">
                <div class="provider-info__icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="provider-info__details">
                  <span class="provider-info__label">Teléfono</span>
                  <span class="provider-info__value">{{ provider.telefono }}</span>
                </div>
              </div>

              <div class="provider-info__item provider-info__item--full">
                <div class="provider-info__icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="provider-info__details">
                  <span class="provider-info__label">Dirección</span>
                  <span class="provider-info__value">{{ provider.direccion }}</span>
                </div>
              </div>

              <div class="provider-info__item" v-if="provider.personaContacto">
                <div class="provider-info__icon">
                  <i class="fas fa-user"></i>
                </div>
                <div class="provider-info__details">
                  <span class="provider-info__label">Contacto</span>
                  <span class="provider-info__value">{{ provider.personaContacto }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con productos -->
          <div class="provider-card__footer">
            <div class="provider-products">
              <div class="provider-products__info">
                <i class="fas fa-box"></i>
                <span class="provider-products__count">{{ getProviderProductsCount(provider.id) }} productos</span>
              </div>
              <router-link :to="`/admin/products?provider=${provider.id}`" class="provider-products__link">
                Ver productos 
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredProviders.length === 0" class="empty-state">
          <div class="empty-state__icon">
            <i class="fas fa-building"></i>
          </div>
          <h3 class="empty-state__title">
            {{ searchQuery ? 'Sin resultados' : 'No hay proveedores' }}
          </h3>
          <p class="empty-state__description">
            {{ searchQuery ? 'No se encontraron proveedores con ese criterio' : 'Aún no tienes proveedores registrados en tu sistema' }}
          </p>
          <button class="empty-state__btn" @click="createProvider">
            <i class="fas fa-plus"></i>
            {{ searchQuery ? 'Limpiar búsqueda' : 'Añadir primer proveedor' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de edición/creación de proveedor -->
    <AdminModal v-model="showProviderModal" :title="isCreating ? 'Crear Nuevo Proveedor' : 'Editar Proveedor'"
      v-if="editingProvider">
      <AdminForm @submit="saveProvider">
        <div class="admin-form__row">
          <div class="admin-form__col" v-if="!isCreating">
            <AdminFormGroup label="ID">
              <AdminInput :value="editingProvider.id" disabled />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="Nombre de la empresa" required :error="validationErrors.nombre">
              <AdminInput v-model="editingProvider.nombre" :error="!!validationErrors.nombre" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="NIF" required :error="validationErrors.nif">
              <AdminInput v-model="editingProvider.nif" :error="!!validationErrors.nif" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Email" required :error="validationErrors.email">
              <AdminInput type="email" v-model="editingProvider.email" :error="!!validationErrors.email" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Teléfono" required :error="validationErrors.telefono">
              <AdminInput type="tel" v-model="editingProvider.telefono" :error="!!validationErrors.telefono" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Persona de contacto">
              <AdminInput v-model="editingProvider.personaContacto" />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="Dirección" required :error="validationErrors.direccion">
              <AdminTextarea v-model="editingProvider.direccion" :error="!!validationErrors.direccion" rows="3"
                required />
            </AdminFormGroup>
          </div>
        </div>
      </AdminForm>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelEdit" :disabled="loading">
          <i class="fas fa-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="modal-btn primary-btn" @click="saveProvider" :disabled="loading">
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-save"></i>
          <span>{{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Proveedor' : 'Guardar Cambios') }}</span>
        </button>
      </template>
    </AdminModal>

    <!-- Modal de confirmación de borrado -->
    <AdminModal v-model="showDeleteConfirmation" title="Confirmar Eliminación" size="sm" v-if="providerToDelete">
      <div class="confirm-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>
          ¿Estás seguro de que deseas eliminar el proveedor
          <strong>{{ providerToDelete.nombre }}</strong>?
        </p>
      </div>

      <div v-if="getProviderProductsCount(providerToDelete.id) > 0" class="warning-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>
          Este proveedor tiene <strong>{{ getProviderProductsCount(providerToDelete.id) }} productos</strong> asociados.
          <br>
          Si lo eliminas, esos productos quedarán sin proveedor asignado.
        </p>
      </div>

      <p>Esta acción no se puede deshacer.</p>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelDelete" :disabled="loading">
          <i class="fas fa-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="modal-btn error-btn" @click="deleteProvider" :disabled="loading">
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-trash-alt"></i>
          <span>{{ loading ? 'Eliminando...' : 'Eliminar Proveedor' }}</span>
        </button>
      </template>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { useToast } from 'vue-toastification';

// Componentes
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSearch from '@/components/admin/AdminSearch.vue';
import AdminModal from '@/components/admin/AdminModal.vue';
import AdminForm from '@/components/admin/AdminForm.vue';
import AdminFormGroup from '@/components/admin/AdminFormGroup.vue';
import AdminInput from '@/components/admin/AdminInput.vue';
import AdminTextarea from '@/components/admin/AdminTextarea.vue';

interface Proveedor {
  id: number;
  nombre: string;
  direccion: string;
  nif: string;
  telefono: string;
  email: string;
  personaContacto: string;
}

const adminStore = useAdminStore();
const toast = useToast();

const searchQuery = ref('');
const loading = ref(false);
const editingProvider = ref<Partial<Proveedor> | null>(null);
const providerToDelete = ref<Proveedor | null>(null);
const validationErrors = ref<Record<string, string>>({});
const showProviderModal = ref(false);
const showDeleteConfirmation = ref(false);

// Computed properties
const isCreating = computed(() => !editingProvider.value?.id);

const filteredProviders = computed(() => {
  if (!searchQuery.value.trim()) return adminStore.providers;

  const query = searchQuery.value.toLowerCase().trim();
  return adminStore.providers.filter(provider =>
    provider.nombre.toLowerCase().includes(query) ||
    provider.nif.toLowerCase().includes(query) ||
    provider.email.toLowerCase().includes(query) ||
    provider.personaContacto?.toLowerCase().includes(query) ||
    String(provider.id).includes(query)
  );
});

onMounted(async () => {
  if (adminStore.providers.length === 0) {
    await adminStore.fetchAllProviders();
  }
  if (adminStore.products.length === 0) {
    await adminStore.fetchAllProducts();
  }
});

// Métodos
const getProviderProductsCount = (providerId: number) => {
  return adminStore.products.filter(product => product.proveedorId === providerId).length;
};

const validateProvider = (): boolean => {
  validationErrors.value = {};

  if (!editingProvider.value) return false;

  if (!editingProvider.value.nombre?.trim()) {
    validationErrors.value.nombre = 'El nombre de la empresa es obligatorio';
  }

  if (!editingProvider.value.nif?.trim()) {
    validationErrors.value.nif = 'El NIF es obligatorio';
  }

  if (!editingProvider.value.email?.trim()) {
    validationErrors.value.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingProvider.value.email)) {
    validationErrors.value.email = 'El email no tiene un formato válido';
  }

  if (!editingProvider.value.telefono?.trim()) {
    validationErrors.value.telefono = 'El teléfono es obligatorio';
  }

  if (!editingProvider.value.direccion?.trim()) {
    validationErrors.value.direccion = 'La dirección es obligatoria';
  }

  return Object.keys(validationErrors.value).length === 0;
};

const createProvider = () => {
  console.log('Creando nuevo proveedor...');
  editingProvider.value = {
    nombre: '',
    direccion: '',
    nif: '',
    telefono: '',
    email: '',
    personaContacto: ''
  };
  showProviderModal.value = true;
};

const editProvider = (provider: Proveedor) => {
  console.log('Editando proveedor:', provider);
  editingProvider.value = { ...provider };
  showProviderModal.value = true;
};

const cancelEdit = () => {
  console.log('Cancelando edición...');
  showProviderModal.value = false;
  editingProvider.value = null;
  validationErrors.value = {};
};

const saveProvider = async () => {
  console.log('Guardando proveedor...', editingProvider.value);
  
  if (!editingProvider.value) {
    toast.error('No hay datos de proveedor para guardar');
    return;
  }

  if (!validateProvider()) {
    toast.error('Por favor, corrija los errores del formulario');
    return;
  }

  loading.value = true;
  try {
    if (isCreating.value) {
      // Crear nuevo proveedor
      console.log('Creando proveedor:', editingProvider.value);
      await adminStore.createProvider(editingProvider.value as Omit<Proveedor, 'id'>);
      toast.success('Proveedor creado correctamente');
    } else {
      // Actualizar proveedor existente
      console.log('Actualizando proveedor:', editingProvider.value);
      await adminStore.updateProvider(editingProvider.value as Proveedor);
      
      // SOLUCIÓN: Recargar todos los proveedores para asegurar sincronización
      console.log('Recargando lista de proveedores...');
      await adminStore.fetchAllProviders();
      
      toast.success('Proveedor actualizado correctamente');
    }
    
    showProviderModal.value = false;
    editingProvider.value = null;
    validationErrors.value = {};
    
    console.log('Operación completada. Total proveedores:', adminStore.providers.length);
    
  } catch (error: any) {
    console.error('Error al guardar proveedor:', error);
    toast.error(`Error: ${error.message || 'Ha ocurrido un error'}`);
  } finally {
    loading.value = false;
  }
};

const confirmDeleteProvider = (provider: Proveedor) => {
  console.log('Confirmando eliminación de proveedor:', provider);
  providerToDelete.value = provider;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  console.log('Cancelando eliminación');
  showDeleteConfirmation.value = false;
  providerToDelete.value = null;
};

const deleteProvider = async () => {
  console.log('Eliminando proveedor...', providerToDelete.value);
  
  if (!providerToDelete.value) {
    toast.error('No hay proveedor seleccionado para eliminar');
    return;
  }

  loading.value = true;
  try {
    await adminStore.deleteProvider(providerToDelete.value.id);
    
    // SOLUCIÓN: Recargar todos los proveedores después de eliminar
    console.log('Recargando lista de proveedores después de eliminar...');
    await adminStore.fetchAllProviders();
    
    // También recargar productos ya que pueden haberse afectado
    console.log('Recargando productos afectados...');
    await adminStore.fetchAllProducts();
    
    toast.success('Proveedor eliminado correctamente');
    showDeleteConfirmation.value = false;
    providerToDelete.value = null;
    
    console.log('Eliminación completada. Total proveedores:', adminStore.providers.length);
    
  } catch (error: any) {
    console.error('Error al eliminar proveedor:', error);
    toast.error(`Error: ${error.message || 'Ha ocurrido un error'}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/admin-unified-styles.scss';

.admin-providers {
  .providers-container {
    padding: $spacing-sm;
    
    @media (min-width: $breakpoint-sm) {
      padding: $spacing-md;
    }
    
    @media (min-width: $breakpoint-lg) {
      padding: $spacing-lg;
    }
  }

  .providers-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    justify-items: center;
    max-width: 1400px;
    margin: 0 auto;

    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: $spacing-lg;
    }

    @media (min-width: $breakpoint-lg) {
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: $spacing-xl;
    }
  }

  .provider-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba($border-color, 0.3);
    overflow: hidden;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    position: relative;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      border-color: rgba($primary-color, 0.3);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, $primary-color 0%, #059447 50%, $primary-color 100%);
    }

    &__header {
      padding: $spacing-lg $spacing-md $spacing-md;
      text-align: center;
      position: relative;
      background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-xl $spacing-lg $spacing-lg;
      }
    }

    &__icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
      border-radius: $border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-md;
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);

      i {
        font-size: 24px;
        color: white;
      }

      @media (min-width: $breakpoint-sm) {
        width: 70px;
        height: 70px;
        
        i {
          font-size: 28px;
        }
      }
    }

    &__title {
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;
      line-height: 1.3;
      text-align: center;

      @media (min-width: $breakpoint-sm) {
        font-size: $font-size-xl;
      }
    }

    &__actions {
      position: absolute;
      top: $spacing-md;
      right: $spacing-md;
      display: flex;
      gap: $spacing-xs;
    }

    &__content {
      padding: 0 $spacing-md $spacing-md;
      flex: 1;

      @media (min-width: $breakpoint-sm) {
        padding: 0 $spacing-lg $spacing-lg;
      }
    }

    &__footer {
      background-color: rgba($tertiary-color, 0.5);
      padding: $spacing-md;
      border-top: 1px solid rgba($border-color, 0.2);

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-lg;
      }
    }
  }

  .action-btn {
    width: 36px;
    height: 36px;
    border-radius: $border-radius-circle;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;

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

  .provider-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    &__item {
      display: flex;
      align-items: flex-start;
      gap: $spacing-sm;
      padding: $spacing-sm;
      background-color: rgba(white, 0.7);
      border-radius: $border-radius;
      border: 1px solid rgba($border-color, 0.1);
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba($primary-color, 0.02);
        border-color: rgba($primary-color, 0.1);
      }

      &--full {
        grid-column: 1 / -1;
      }
    }

    &__icon {
      width: 32px;
      height: 32px;
      background-color: rgba($primary-color, 0.1);
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;

      i {
        font-size: 14px;
        color: $primary-color;
      }
    }

    &__details {
      flex: 1;
      min-width: 0;
    }

    &__label {
      display: block;
      font-size: $font-size-small;
      font-weight: $font-weight-semibold;
      color: $text-color-secondary;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &__value {
      display: block;
      font-size: $font-size-base;
      color: $text-color;
      word-break: break-word;
      line-height: 1.4;
    }
  }

  .provider-products {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;

    &__info {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      color: $text-color-secondary;
      font-size: $font-size-small;
      font-weight: $font-weight-medium;

      i {
        color: $primary-color;
        font-size: 16px;
      }
    }

    &__count {
      color: $text-color;
    }

    &__link {
      color: $primary-color;
      text-decoration: none;
      font-weight: $font-weight-semibold;
      font-size: $font-size-small;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius;
      background-color: rgba($primary-color, 0.05);
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba($primary-color, 0.1);
        transform: translateX(2px);

        i {
          transform: translateX(3px);
        }
      }

      i {
        font-size: 12px;
        transition: transform 0.2s ease;
      }
    }
  }

  .empty-state {
    grid-column: 1 / -1;
    max-width: 500px;
    width: 100%;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: $border-radius-lg;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 2px dashed rgba($primary-color, 0.2);
    padding: $spacing-xl;
    text-align: center;
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
        font-size: 36px;
        color: rgba($primary-color, 0.6);
      }
    }

    &__title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;
    }

    &__description {
      color: $text-color-secondary;
      margin: 0 0 $spacing-xl;
      line-height: 1.5;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: $spacing-xl;
    }

    &__btn {
      display: inline-flex;
      align-items: center;
      gap: $spacing-sm;
      background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
      color: white;
      border: none;
      border-radius: $border-radius;
      padding: $spacing-md $spacing-lg;
      font-weight: $font-weight-semibold;
      font-size: $font-size-base;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba($primary-color, 0.4);
      }

      i {
        font-size: 16px;
      }
    }
  }
}
</style>