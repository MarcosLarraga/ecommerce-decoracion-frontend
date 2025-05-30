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

    <div class="admin-providers__container">
      <div class="admin-providers__grid">
        <div v-for="provider in filteredProviders" :key="provider.id" class="admin-providers__card">
          <!-- Header de la tarjeta -->
          <div class="admin-providers__card-header">
            <div class="admin-providers__card-icon">
              <i class="fas fa-building"></i>
            </div>
            <h3 class="admin-providers__card-title">{{ provider.nombre }}</h3>
            <div class="admin-providers__card-actions">
              <button class="admin-providers__action-btn admin-providers__action-btn--edit" @click="editProvider(provider)" title="Editar proveedor">
                <i class="fas fa-edit"></i>
              </button>
              <button class="admin-providers__action-btn admin-providers__action-btn--delete" @click="confirmDeleteProvider(provider)" title="Eliminar proveedor">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>

          <!-- Contenido principal -->
          <div class="admin-providers__card-content">
            <div class="admin-providers__info">
              <div class="admin-providers__info-item">
                <div class="admin-providers__info-icon">
                  <i class="fas fa-id-card"></i>
                </div>
                <div class="admin-providers__info-details">
                  <span class="admin-providers__info-label">NIF</span>
                  <span class="admin-providers__info-value">{{ provider.nif }}</span>
                </div>
              </div>

              <div class="admin-providers__info-item">
                <div class="admin-providers__info-icon">
                  <i class="fas fa-envelope"></i>
                </div>
                <div class="admin-providers__info-details">
                  <span class="admin-providers__info-label">Email</span>
                  <span class="admin-providers__info-value">{{ provider.email }}</span>
                </div>
              </div>

              <div class="admin-providers__info-item">
                <div class="admin-providers__info-icon">
                  <i class="fas fa-phone"></i>
                </div>
                <div class="admin-providers__info-details">
                  <span class="admin-providers__info-label">Teléfono</span>
                  <span class="admin-providers__info-value">{{ provider.telefono }}</span>
                </div>
              </div>

              <div class="admin-providers__info-item admin-providers__info-item--full">
                <div class="admin-providers__info-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="admin-providers__info-details">
                  <span class="admin-providers__info-label">Dirección</span>
                  <span class="admin-providers__info-value">{{ provider.direccion }}</span>
                </div>
              </div>

              <div class="admin-providers__info-item" v-if="provider.personaContacto">
                <div class="admin-providers__info-icon">
                  <i class="fas fa-user"></i>
                </div>
                <div class="admin-providers__info-details">
                  <span class="admin-providers__info-label">Contacto</span>
                  <span class="admin-providers__info-value">{{ provider.personaContacto }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con productos -->
          <div class="admin-providers__card-footer">
            <div class="admin-providers__products">
              <div class="admin-providers__products-info">
                <i class="fas fa-box"></i>
                <span class="admin-providers__products-count">{{ getProviderProductsCount(provider.id) }} productos</span>
              </div>
              <router-link :to="`/admin/products?provider=${provider.id}`" class="admin-providers__products-link">
                Ver productos 
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredProviders.length === 0" class="admin-providers__empty">
          <div class="admin-providers__empty-icon">
            <i class="fas fa-building"></i>
          </div>
          <h3 class="admin-providers__empty-title">
            {{ searchQuery ? 'Sin resultados' : 'No hay proveedores' }}
          </h3>
          <p class="admin-providers__empty-description">
            {{ searchQuery ? 'No se encontraron proveedores con ese criterio' : 'Aún no tienes proveedores registrados en tu sistema' }}
          </p>
          <button class="admin-providers__empty-btn" @click="createProvider">
            <i class="fas fa-plus"></i>
            {{ searchQuery ? 'Limpiar búsqueda' : 'Añadir primer proveedor' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de edición/creación de proveedor -->
    <div v-if="showProviderModal" class="admin-providers__modal-overlay" @click="handleOverlayClick">
      <div class="admin-providers__modal" @click.stop>
        <div class="admin-providers__modal-header">
          <h2 class="admin-providers__modal-title">
            {{ isCreating ? 'Crear Nuevo Proveedor' : 'Editar Proveedor' }}
          </h2>
          <button class="admin-providers__modal-close" @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-providers__modal-body">
          <form class="admin-providers__form" @submit.prevent="saveProvider">
            <div class="admin-providers__form-grid">
              <!-- Campo ID solo en edición -->
              <div v-if="!isCreating" class="admin-providers__form-group">
                <label class="admin-providers__form-label">ID</label>
                <input class="admin-providers__form-input" :value="editingProvider?.id" disabled readonly />
              </div>

              <!-- Campo Nombre -->
              <div class="admin-providers__form-group" :class="{ 'admin-providers__form-group--full': isCreating }">
                <label class="admin-providers__form-label">
                  Nombre de la empresa <span class="admin-providers__form-required">*</span>
                </label>
                <input v-model="editingProvider.nombre" class="admin-providers__form-input"
                  :class="{ 'admin-providers__form-input--error': validationErrors.nombre }"
                  placeholder="Nombre de la empresa" required />
                <div v-if="validationErrors.nombre" class="admin-providers__form-error">
                  {{ validationErrors.nombre }}
                </div>
              </div>

              <!-- Campo NIF -->
              <div class="admin-providers__form-group" :class="{ 'admin-providers__form-group--full': isCreating }">
                <label class="admin-providers__form-label">
                  NIF <span class="admin-providers__form-required">*</span>
                </label>
                <input v-model="editingProvider.nif" class="admin-providers__form-input"
                  :class="{ 'admin-providers__form-input--error': validationErrors.nif }"
                  placeholder="12345678A" required />
                <div v-if="validationErrors.nif" class="admin-providers__form-error">
                  {{ validationErrors.nif }}
                </div>
              </div>

              <!-- Campo Email -->
              <div class="admin-providers__form-group">
                <label class="admin-providers__form-label">
                  Email <span class="admin-providers__form-required">*</span>
                </label>
                <input v-model="editingProvider.email" type="email" class="admin-providers__form-input"
                  :class="{ 'admin-providers__form-input--error': validationErrors.email }"
                  placeholder="correo@empresa.com" required />
                <div v-if="validationErrors.email" class="admin-providers__form-error">
                  {{ validationErrors.email }}
                </div>
              </div>

              <!-- Campo Teléfono -->
              <div class="admin-providers__form-group">
                <label class="admin-providers__form-label">
                  Teléfono <span class="admin-providers__form-required">*</span>
                </label>
                <input v-model="editingProvider.telefono" type="tel" class="admin-providers__form-input"
                  :class="{ 'admin-providers__form-input--error': validationErrors.telefono }"
                  placeholder="+34 123 456 789" required />
                <div v-if="validationErrors.telefono" class="admin-providers__form-error">
                  {{ validationErrors.telefono }}
                </div>
              </div>

              <!-- Campo Persona de contacto -->
              <div class="admin-providers__form-group">
                <label class="admin-providers__form-label">Persona de contacto</label>
                <input v-model="editingProvider.personaContacto" class="admin-providers__form-input"
                  placeholder="Nombre del contacto" />
              </div>

              <!-- Campo Dirección -->
              <div class="admin-providers__form-group admin-providers__form-group--full">
                <label class="admin-providers__form-label">
                  Dirección <span class="admin-providers__form-required">*</span>
                </label>
                <textarea v-model="editingProvider.direccion" class="admin-providers__form-textarea" rows="3"
                  :class="{ 'admin-providers__form-input--error': validationErrors.direccion }"
                  placeholder="Dirección completa de la empresa" required></textarea>
                <div v-if="validationErrors.direccion" class="admin-providers__form-error">
                  {{ validationErrors.direccion }}
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="admin-providers__modal-footer">
          <button class="admin-providers__modal-btn admin-providers__modal-btn--secondary" @click="cancelEdit"
            :disabled="loading">
            Cancelar
          </button>
          <button class="admin-providers__modal-btn admin-providers__modal-btn--primary" @click="saveProvider"
            :disabled="loading || !isFormValid">
            <i v-if="loading" class="admin-providers__spinner"></i>
            {{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Proveedor' : 'Guardar Cambios') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de borrado -->
    <div v-if="showDeleteConfirmation" class="admin-providers__modal-overlay" @click="cancelDelete">
      <div class="admin-providers__modal admin-providers__modal--small" @click.stop>
        <div class="admin-providers__modal-header">
          <h2 class="admin-providers__modal-title">Confirmar Eliminación</h2>
          <button class="admin-providers__modal-close" @click="cancelDelete">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-providers__modal-body">
          <div class="admin-providers__confirm">
            <i class="fas fa-exclamation-triangle admin-providers__confirm-icon"></i>
            <p class="admin-providers__confirm-text">
              ¿Eliminar el proveedor <strong>{{ providerToDelete?.nombre }}</strong>?
            </p>

            <div v-if="getProviderProductsCount(providerToDelete?.id || 0) > 0" class="admin-providers__warning">
              <i class="fas fa-exclamation-circle"></i>
              <p>
                Este proveedor tiene <strong>{{ getProviderProductsCount(providerToDelete?.id || 0) }} productos</strong> asociados.
                <br>
                Si lo eliminas, esos productos quedarán sin proveedor asignado.
              </p>
            </div>

            <p class="admin-providers__confirm-text">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        <div class="admin-providers__modal-footer">
          <button class="admin-providers__modal-btn admin-providers__modal-btn--secondary" @click="cancelDelete"
            :disabled="loading">
            Cancelar
          </button>
          <button class="admin-providers__modal-btn admin-providers__modal-btn--danger" @click="deleteProvider" :disabled="loading">
            <i v-if="loading" class="admin-providers__spinner"></i>
            {{ loading ? 'Eliminando...' : 'Eliminar Proveedor' }}
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

// Componentes
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSearch from '@/components/admin/AdminSearch.vue';

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
const editingProvider = ref<Partial<Proveedor>>({
  nombre: '',
  direccion: '',
  nif: '',
  telefono: '',
  email: '',
  personaContacto: ''
});
const providerToDelete = ref<Proveedor | null>(null);
const validationErrors = ref<Record<string, string>>({});
const showProviderModal = ref(false);
const showDeleteConfirmation = ref(false);

// Computed properties
const isCreating = computed(() => !editingProvider.value?.id);

const isFormValid = computed(() => {
  if (!editingProvider.value) return false;

  const hasName = editingProvider.value.nombre?.trim();
  const hasNIF = editingProvider.value.nif?.trim();
  const hasEmail = editingProvider.value.email?.trim();
  const hasPhone = editingProvider.value.telefono?.trim();
  const hasAddress = editingProvider.value.direccion?.trim();

  return hasName && hasNIF && hasEmail && hasPhone && hasAddress && Object.keys(validationErrors.value).length === 0;
});

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

// Watchers para validación en tiempo real
watch(() => editingProvider.value.nombre, (newValue) => {
  if (validationErrors.value.nombre && newValue?.trim()) {
    delete validationErrors.value.nombre;
  }
});

watch(() => editingProvider.value.nif, (newValue) => {
  if (validationErrors.value.nif && newValue?.trim()) {
    delete validationErrors.value.nif;
  }
});

watch(() => editingProvider.value.email, (newValue) => {
  if (validationErrors.value.email && newValue?.trim()) {
    delete validationErrors.value.email;
  }
});

watch(() => editingProvider.value.telefono, (newValue) => {
  if (validationErrors.value.telefono && newValue?.trim()) {
    delete validationErrors.value.telefono;
  }
});

watch(() => editingProvider.value.direccion, (newValue) => {
  if (validationErrors.value.direccion && newValue?.trim()) {
    delete validationErrors.value.direccion;
  }
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

const resetForm = () => {
  editingProvider.value = {
    nombre: '',
    direccion: '',
    nif: '',
    telefono: '',
    email: '',
    personaContacto: ''
  };
  validationErrors.value = {};
};

const createProvider = () => {
  console.log('Creando nuevo proveedor...');
  resetForm();
  showProviderModal.value = true;
};

const editProvider = (provider: Proveedor) => {
  console.log('Editando proveedor:', provider);
  
  // Crear una copia profunda del proveedor
  editingProvider.value = {
    id: provider.id,
    nombre: provider.nombre || '',
    direccion: provider.direccion || '',
    nif: provider.nif || '',
    telefono: provider.telefono || '',
    email: provider.email || '',
    personaContacto: provider.personaContacto || ''
  };
  
  validationErrors.value = {};
  showProviderModal.value = true;
  
  console.log('Proveedor para editar:', editingProvider.value);
};

const handleOverlayClick = () => {
  cancelEdit();
};

const cancelEdit = () => {
  console.log('Cancelando edición...');
  showProviderModal.value = false;
  resetForm();
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
      
      const providerData = {
        nombre: editingProvider.value.nombre.trim(),
        direccion: editingProvider.value.direccion.trim(),
        nif: editingProvider.value.nif.trim(),
        telefono: editingProvider.value.telefono.trim(),
        email: editingProvider.value.email.trim(),
        personaContacto: editingProvider.value.personaContacto?.trim() || ''
      };
      
      await adminStore.createProvider(providerData);
      
      // Recargar todos los proveedores después de crear
      console.log('Recargando lista de proveedores después de crear...');
      await adminStore.fetchAllProviders();
      
      toast.success('Proveedor creado correctamente');
    } else {
      // Actualizar proveedor existente
      console.log('Actualizando proveedor:', editingProvider.value);
      
      const providerData = {
        id: editingProvider.value.id!,
        nombre: editingProvider.value.nombre.trim(),
        direccion: editingProvider.value.direccion.trim(),
        nif: editingProvider.value.nif.trim(),
        telefono: editingProvider.value.telefono.trim(),
        email: editingProvider.value.email.trim(),
        personaContacto: editingProvider.value.personaContacto?.trim() || ''
      };
      
      await adminStore.updateProvider(providerData);
      
      // Recargar todos los proveedores para asegurar sincronización
      console.log('Recargando lista de proveedores...');
      await adminStore.fetchAllProviders();
      
      toast.success('Proveedor actualizado correctamente');
    }
    
    // Cerrar modal y limpiar formulario
    showProviderModal.value = false;
    resetForm();
    
    console.log('Operación completada. Total proveedores:', adminStore.providers.length);
    
  } catch (error: any) {
    console.error('Error al guardar proveedor:', error);
    toast.error(error.message || 'Error al guardar proveedor');
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
  
  if (!providerToDelete.value?.id) {
    toast.error('No hay proveedor seleccionado para eliminar');
    return;
  }

  loading.value = true;

  try {
    await adminStore.deleteProvider(providerToDelete.value.id);
    
    // Recargar todos los proveedores después de eliminar
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
    toast.error(error.message || 'Error al eliminar proveedor');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-providers {
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

  &__container {
    padding: $spacing-sm;
    
    @media (min-width: $breakpoint-sm) {
      padding: $spacing-md;
    }
    
    @media (min-width: $breakpoint-lg) {
      padding: $spacing-lg;
    }
  }

  &__grid {
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

  &__card {
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

    &-header {
      padding: $spacing-lg $spacing-md $spacing-md;
      text-align: center;
      position: relative;
      background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-xl $spacing-lg $spacing-lg;
      }
    }

    &-icon {
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

    &-title {
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

    &-actions {
      position: absolute;
      top: $spacing-md;
      right: $spacing-md;
      display: flex;
      gap: $spacing-xs;
    }

    &-content {
      padding: 0 $spacing-md $spacing-md;
      flex: 1;

      @media (min-width: $breakpoint-sm) {
        padding: 0 $spacing-lg $spacing-lg;
      }
    }

    &-footer {
      background-color: rgba($tertiary-color, 0.5);
      padding: $spacing-md;
      border-top: 1px solid rgba($border-color, 0.2);

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-lg;
      }
    }
  }

  &__action-btn {
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

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    &-item {
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

    &-icon {
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

    &-details {
      flex: 1;
      min-width: 0;
    }

    &-label {
      display: block;
      font-size: $font-size-small;
      font-weight: $font-weight-semibold;
      color: $text-color-secondary;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    &-value {
      display: block;
      font-size: $font-size-base;
      color: $text-color;
      word-break: break-word;
      line-height: 1.4;
    }
  }

  &__products {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-sm;

    &-info {
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

    &-count {
      color: $text-color;
    }

    &-link {
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

  &__empty {
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

    &-icon {
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

    &-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;
    }

    &-description {
      color: $text-color-secondary;
      margin: 0 0 $spacing-xl;
      line-height: 1.5;
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: $spacing-xl;
    }

    &-btn {
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
    max-width: 600px;
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

  &__form-textarea {
    resize: vertical;
    font-family: inherit;
    min-height: 80px;
  }

  &__form-error {
    color: $error-color;
    font-size: $font-size-small;
    margin-top: $spacing-xs;
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
    margin: 0 0 $spacing-md;
    
    strong {
      color: $text-color;
      font-weight: $font-weight-semibold;
    }
  }

  &__warning {
    background: rgba($warning-color, 0.1);
    border: 1px solid rgba($warning-color, 0.3);
    border-radius: $border-radius;
    padding: $spacing-md;
    margin: $spacing-md 0;
    text-align: left;
    
    i {
      color: $warning-color;
      margin-right: $spacing-xs;
    }
    
    p {
      margin: 0;
      color: $text-color;
      font-size: $font-size-small;
      line-height: 1.4;
      
      strong {
        color: $warning-color;
        font-weight: $font-weight-semibold;
      }
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
    
    .admin-providers__modal-btn--secondary & {
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
  }
} </style>