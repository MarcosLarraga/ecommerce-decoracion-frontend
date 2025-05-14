<!-- @/views/admin/AdminProviders.vue con botones nativos y estilo mobile-first -->
<template>
  <div class="admin-providers">
    <AdminHeader title="Gestión de Proveedores">
      <template #actions>
        <AdminSearch v-model="searchQuery" placeholder="Buscar proveedores..." />
        <button class="header-btn" @click="createProvider">
          <span class="icon">➕</span>
          <span class="text">Añadir Proveedor</span>
        </button>
      </template>
    </AdminHeader>

    <div class="providers-grid">
      <div v-for="provider in filteredProviders" :key="provider.id" class="provider-card">
        <div class="provider-card__header">
          <h3 class="provider-card__title">{{ provider.nombre }}</h3>
          <div class="provider-card__actions">
            <button class="card-btn edit-btn" @click="editProvider(provider)" title="Editar proveedor">
              ✏️
            </button>
            <button class="card-btn delete-btn" @click="confirmDeleteProvider(provider)" title="Eliminar proveedor">
              🗑️
            </button>
          </div>
        </div>

        <div class="provider-card__content">
          <div class="provider-card__info">
            <div class="provider-card__item">
              <span class="provider-card__icon">🪪</span>
              <span class="provider-card__label">NIF:</span>
              <span class="provider-card__value">{{ provider.nif }}</span>
            </div>

            <div class="provider-card__item">
              <span class="provider-card__icon">✉️</span>
              <span class="provider-card__label">Email:</span>
              <span class="provider-card__value">{{ provider.email }}</span>
            </div>

            <div class="provider-card__item">
              <span class="provider-card__icon">📞</span>
              <span class="provider-card__label">Teléfono:</span>
              <span class="provider-card__value">{{ provider.telefono }}</span>
            </div>

            <div class="provider-card__item">
              <span class="provider-card__icon">📍</span>
              <span class="provider-card__label">Dirección:</span>
              <span class="provider-card__value">{{ provider.direccion }}</span>
            </div>

            <div class="provider-card__item" v-if="provider.personaContacto">
              <span class="provider-card__icon">👤</span>
              <span class="provider-card__label">Contacto:</span>
              <span class="provider-card__value">{{ provider.personaContacto }}</span>
            </div>
          </div>
        </div>

        <div class="provider-card__footer">
          <div class="provider-card__products">
            <span class="provider-card__products-count">
              {{ getProviderProductsCount(provider.id) }} productos
            </span>
            <router-link :to="`/admin/products?provider=${provider.id}`" class="provider-card__products-link">
              Ver productos <span class="arrow">→</span>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="filteredProviders.length === 0" class="providers-empty">
        <span class="empty-icon">🚚</span>
        <p>{{ searchQuery ? 'No se encontraron proveedores con ese criterio' : 'No hay proveedores registrados' }}</p>
        <button class="empty-btn" @click="createProvider">
          <span class="icon">➕</span>
          Añadir el primer proveedor
        </button>
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
          Cancelar
        </button>
        <button class="modal-btn primary-btn" @click="saveProvider" :disabled="loading">
          {{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Proveedor' : 'Guardar Cambios') }}
        </button>
      </template>
    </AdminModal>

    <!-- Modal de confirmación de borrado -->
    <AdminModal v-model="showDeleteConfirmation" title="Confirmar Eliminación" size="sm" v-if="providerToDelete">
      <p>¿Estás seguro de que deseas eliminar el proveedor <strong>{{ providerToDelete.nombre }}</strong>?</p>

      <div v-if="getProviderProductsCount(providerToDelete.id) > 0" class="warning-message">
        <span class="warning-icon">⚠️</span>
        <p>
          Este proveedor tiene <strong>{{ getProviderProductsCount(providerToDelete.id) }} productos</strong> asociados.
          <br>
          Si lo eliminas, esos productos quedarán sin proveedor asignado.
        </p>
      </div>

      <p>Esta acción no se puede deshacer.</p>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelDelete" :disabled="loading">
          Cancelar
        </button>
        <button class="modal-btn error-btn" @click="deleteProvider" :disabled="loading">
          {{ loading ? 'Eliminando...' : 'Eliminar Proveedor' }}
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
  editingProvider.value = { ...provider };
  showProviderModal.value = true;
};

const cancelEdit = () => {
  showProviderModal.value = false;
  editingProvider.value = null;
  validationErrors.value = {};
};

const saveProvider = async () => {
  if (!editingProvider.value) return;

  if (!validateProvider()) {
    toast.error('Por favor, corrige los errores del formulario');
    return;
  }

  loading.value = true;
  try {
    if (isCreating.value) {
      await adminStore.createProvider(editingProvider.value as Omit<Proveedor, 'id'>);
      toast.success('Proveedor creado correctamente');
    } else {
      await adminStore.updateProvider(editingProvider.value as Proveedor);
      toast.success('Proveedor actualizado correctamente');
    }
    showProviderModal.value = false;
    editingProvider.value = null;
  } catch (error: any) {
    toast.error(`Error: ${error.message || 'Ha ocurrido un error'}`);
  } finally {
    loading.value = false;
  }
};

const confirmDeleteProvider = (provider: Proveedor) => {
  providerToDelete.value = provider;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
  providerToDelete.value = null;
};

const deleteProvider = async () => {
  if (!providerToDelete.value) return;

  loading.value = true;
  try {
    await adminStore.deleteProvider(providerToDelete.value.id);
    toast.success('Proveedor eliminado correctamente');
    showDeleteConfirmation.value = false;
    providerToDelete.value = null;
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

.admin-providers {
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

  // Rejilla de proveedores
  .providers-grid {
    display: grid;
    grid-template-columns: 1fr; // Una columna en móviles
    gap: $spacing-md;
    margin-top: $spacing-md;

    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(2, 1fr); // Dos columnas en tablets
      gap: $spacing-lg;
      margin-top: $spacing-lg;
    }

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // Ajuste automático en escritorio
    }
  }

  // Tarjeta de proveedor
  .provider-card {
    background-color: white;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform $transition-fast, box-shadow $transition-fast;

    @media (min-width: $breakpoint-sm) {
      border-radius: $border-radius-lg;

      &:hover {
        transform: translateY(-5px);
        box-shadow: $box-shadow-lg;
      }
    }

    &__header {
      padding: $spacing-sm;
      border-bottom: 1px solid $tertiary-color;
      display: flex;
      justify-content: space-between;
      align-items: center;

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-md;
      }
    }

    &__title {
      margin: 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $text-color;

      @media (min-width: $breakpoint-sm) {
        font-size: $font-size-large;
      }
    }

    &__actions {
      display: flex;
      gap: $spacing-xs;
    }

    &__content {
      padding: $spacing-sm;
      flex: 1;

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-md;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      @media (min-width: $breakpoint-sm) {
        gap: $spacing-sm;
      }
    }

    &__item {
      display: flex;
      align-items: flex-start;
      font-size: $font-size-small;

      @media (min-width: $breakpoint-sm) {
        font-size: $font-size-base;
      }
    }

    &__icon {
      width: 16px;
      margin-right: $spacing-xs;
      font-size: 14px;

      @media (min-width: $breakpoint-sm) {
        width: 20px;
        font-size: 16px;
      }
    }

    &__label {
      font-weight: $font-weight-medium;
      color: $text-color-secondary;
      margin-right: $spacing-xs;
      min-width: 60px;

      @media (min-width: $breakpoint-sm) {
        min-width: 70px;
      }
    }

    &__value {
      color: $text-color;
      flex: 1;
      word-break: break-word; // Para evitar desbordamiento en pantallas pequeñas
    }

    &__footer {
      padding: $spacing-sm;
      border-top: 1px solid $tertiary-color;
      background-color: rgba($primary-color, 0.03);

      @media (min-width: $breakpoint-sm) {
        padding: $spacing-md;
      }
    }

    &__products {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      @media (min-width: $breakpoint-sm) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }

    &__products-count {
      font-size: $font-size-small;
      color: $text-color-secondary;
    }

    &__products-link {
      color: $primary-color;
      text-decoration: none;
      font-weight: $font-weight-medium;
      display: flex;
      align-items: center;
      width: 100%; // Ocupar todo el ancho en móviles
      justify-content: center;
      padding: $spacing-xs 0;

      @media (min-width: $breakpoint-sm) {
        width: auto;
        padding: 0;
        justify-content: flex-start;
      }

      .arrow {
        margin-left: $spacing-xs;
        transition: transform $transition-fast;
      }

      &:hover .arrow {
        transform: translateX(3px);
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  // Botones de tarjeta
  .card-btn {
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

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .edit-btn {
    background-color: $primary-color;
    color: white;

    &:hover {
      background-color: $primary-color-hover;
    }
  }

  .delete-btn {
    background-color: $error-color;
    color: white;

    &:hover {
      background-color: $error-color-hover;
    }
  }

  // Estado vacío
  .providers-empty {
    grid-column: 1 / -1;
    background-color: white;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    padding: $spacing-lg;
    text-align: center;

    @media (min-width: $breakpoint-sm) {
      border-radius: $border-radius-lg;
      padding: $spacing-xl;
    }

    .empty-icon {
      font-size: 36px;
      color: $text-color-secondary;
      opacity: 0.3;
      margin-bottom: $spacing-sm;
      display: block;

      @media (min-width: $breakpoint-sm) {
        font-size: 48px;
        margin-bottom: $spacing-md;
      }
    }

    p {
      color: $text-color-secondary;
      margin-bottom: $spacing-md;

      @media (min-width: $breakpoint-sm) {
        margin-bottom: $spacing-lg;
      }
    }

    .empty-btn {
      display: inline-flex;
      align-items: center;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius;
      padding: 0 $spacing-md;
      height: 36px;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $transition-fast;

      @media (min-width: $breakpoint-sm) {
        height: 40px;

        &:hover {
          background-color: $primary-color-hover;
          transform: translateY(-2px);
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
        }
      }

      .icon {
        margin-right: $spacing-xs;
        font-size: 14px;

        @media (min-width: $breakpoint-sm) {
          font-size: 16px;
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

  // Mensaje de advertencia
  .warning-message {
    background-color: rgba($warning-color, 0.1);
    border-left: 4px solid $warning-color;
    padding: $spacing-sm;
    margin: $spacing-sm 0;
    border-radius: $border-radius-sm;
    display: flex;
    align-items: flex-start;
    font-size: $font-size-small;

    @media (min-width: $breakpoint-sm) {
      padding: $spacing-md;
      margin: $spacing-md 0;
      font-size: $font-size-base;
    }

    .warning-icon {
      margin-right: $spacing-xs;
      font-size: 16px;

      @media (min-width: $breakpoint-sm) {
        margin-right: $spacing-sm;
        font-size: 20px;
      }
    }

    p {
      margin: 0;
      color: $text-color;
    }
  }

  // Estilo para el modal en mobile
  :deep(.admin-modal) {
    .modal-content {
      width: 95%;
      max-width: 90vw;

      @media (min-width: $breakpoint-sm) {
        width: auto;
        max-width: 600px;
      }
    }
  }

  // Estilo para el formulario en mobile
  :deep(.admin-form) {
    .admin-form__row {
      gap: $spacing-sm;

      @media (min-width: $breakpoint-sm) {
        gap: $spacing-md;
      }
    }
  }
}
</style>