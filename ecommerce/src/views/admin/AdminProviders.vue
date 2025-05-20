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

    <div class="providers-grid">
      <div v-for="provider in filteredProviders" :key="provider.id" class="info-card">
        <div class="info-card__header">
          <h3 class="info-card__title">
            <i class="fas fa-building"></i>
            {{ provider.nombre }}
          </h3>
          <div class="info-card__actions">
            <button class="btn btn-edit" @click="editProvider(provider)" title="Editar proveedor">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" @click="confirmDeleteProvider(provider)" title="Eliminar proveedor">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <div class="info-card__content">
          <div class="info-card__grid">
            <div class="info-card__item">
              <i class="fas fa-id-card"></i>
              <span class="info-card__label">NIF:</span>
              <span class="info-card__value">{{ provider.nif }}</span>
            </div>

            <div class="info-card__item">
              <i class="fas fa-envelope"></i>
              <span class="info-card__label">Email:</span>
              <span class="info-card__value">{{ provider.email }}</span>
            </div>

            <div class="info-card__item">
              <i class="fas fa-phone"></i>
              <span class="info-card__label">Teléfono:</span>
              <span class="info-card__value">{{ provider.telefono }}</span>
            </div>

            <div class="info-card__item">
              <i class="fas fa-map-marker-alt"></i>
              <span class="info-card__label">Dirección:</span>
              <span class="info-card__value">{{ provider.direccion }}</span>
            </div>

            <div class="info-card__item" v-if="provider.personaContacto">
              <i class="fas fa-user"></i>
              <span class="info-card__label">Contacto:</span>
              <span class="info-card__value">{{ provider.personaContacto }}</span>
            </div>
          </div>
        </div>

        <div class="provider-footer">
          <div class="provider-products">
            <span class="provider-products__count">
              <i class="fas fa-box"></i> {{ getProviderProductsCount(provider.id) }} productos
            </span>
            <router-link :to="`/admin/products?provider=${provider.id}`" class="provider-products__link">
              Ver productos <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="filteredProviders.length === 0" class="empty-state">
        <i class="fas fa-building"></i>
        <p>{{ searchQuery ? 'No se encontraron proveedores con ese criterio' : 'No hay proveedores registrados' }}</p>
        <button class="empty-btn" @click="createProvider">
          <i class="fas fa-plus"></i>
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
    toast.error('Por favor, corrija los errores del formulario');
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

<style lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/admin-unified-styles.scss';

.admin-providers {
  .providers-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    margin-top: $spacing-md;

    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-lg;
      margin-top: $spacing-lg;
    }

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }

  .provider-footer {
    border-top: 1px solid $border-color;
    padding-top: $spacing-md;
    margin-top: $spacing-md;
  }

  .provider-products {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__count {
      color: $text-color-secondary;
      font-size: $font-size-small;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }

    &__link {
      color: $primary-color;
      text-decoration: none;
      font-weight: $font-weight-medium;
      display: flex;
      align-items: center;
      gap: $spacing-xs;

      i {
        transition: transform $transition-fast;
      }

      &:hover i {
        transform: translateX(3px);
      }
    }
  }

  .empty-state {
    grid-column: 1 / -1;
    background-color: white;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    padding: $spacing-xl;
    text-align: center;

    i {
      font-size: 3rem;
      color: $text-color-secondary;
      opacity: 0.3;
      margin-bottom: $spacing-md;
      display: block;
    }

    p {
      color: $text-color-secondary;
      margin-bottom: $spacing-lg;
    }

    .empty-btn {
      display: inline-flex;
      align-items: center;
      gap: $spacing-sm;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius;
      padding: $spacing-sm $spacing-lg;
      font-weight: $font-weight-medium;
      cursor: pointer;
      transition: all $transition-fast;

      &:hover {
        background-color: $primary-color-hover;
        transform: translateY(-2px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>