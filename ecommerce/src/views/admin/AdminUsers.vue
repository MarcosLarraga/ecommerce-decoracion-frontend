<!-- @/views/admin/AdminUsers.vue -->
<template>
  <div class="admin-view admin-users">
    <!-- Header móvil optimizado -->
    <div class="admin-users__header">
      <h1 class="admin-users__title">Gestión de Usuarios</h1>

      <!-- Búsqueda -->
      <div class="admin-users__search">
        <input v-model="searchQuery" placeholder="Buscar usuarios..." class="admin-users__search-input" />
        <i class="fas fa-search admin-users__search-icon"></i>
      </div>

      <!-- Botón crear usuario -->
      <button class="admin-users__create-btn" @click="createUser">
        <i class="fas fa-user-plus"></i>
        <span class="admin-users__create-btn-text">Nuevo</span>
      </button>
    </div>

    <!-- Estado de carga inicial -->
    <div v-if="adminStore.loading && adminStore.users.length === 0" class="admin-users__loading">
      <div class="admin-users__spinner"></div>
      <p>Cargando usuarios...</p>
    </div>

    <!-- Contenido principal -->
    <div v-else class="admin-users__content">
      <!-- Vista móvil: Cards -->
      <div class="admin-users__mobile-list">
        <div v-if="filteredUsers.length === 0" class="admin-users__empty">
          <i class="fas fa-users"></i>
          <p>{{ searchQuery ? 'No se encontraron usuarios' : 'No hay usuarios registrados' }}</p>
        </div>

        <div v-for="user in filteredUsers" :key="user.id" class="admin-users__card">
          <div class="admin-users__card-header">
            <div class="admin-users__card-id">#{{ user.id }}</div>
            <div class="admin-users__card-role">
              <span class="admin-users__role-badge" :class="{ 'admin-users__role-badge--admin': user.esAdmin }">
                {{ user.esAdmin ? 'Admin' : 'Usuario' }}
              </span>
            </div>
          </div>

          <div class="admin-users__card-body">
            <h3 class="admin-users__card-name">{{ user.nombre }}</h3>
            <p class="admin-users__card-email">{{ user.email }}</p>
            <p v-if="user.telefono" class="admin-users__card-phone">
              <i class="fas fa-phone"></i>
              {{ user.telefono }}
            </p>
          </div>

          <div class="admin-users__card-actions">
            <button class="admin-users__action-btn admin-users__action-btn--edit" @click="editUser(user)"
              title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="admin-users__action-btn admin-users__action-btn--delete" @click="confirmDeleteUser(user)"
              title="Eliminar">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Vista desktop: Tabla -->
      <div class="admin-users__desktop-table">
        <table class="admin-users__table">
          <thead class="admin-users__table-head">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="admin-users__table-body">
            <tr v-for="user in filteredUsers" :key="user.id" class="admin-users__table-row">
              <td class="admin-users__table-cell">#{{ user.id }}</td>
              <td class="admin-users__table-cell">{{ user.nombre }}</td>
              <td class="admin-users__table-cell">{{ user.email }}</td>
              <td class="admin-users__table-cell">
                <span class="admin-users__role-badge" :class="{ 'admin-users__role-badge--admin': user.esAdmin }">
                  {{ user.esAdmin ? 'Administrador' : 'Usuario' }}
                </span>
              </td>
              <td class="admin-users__table-cell">{{ user.telefono || 'N/A' }}</td>
              <td class="admin-users__table-cell">
                <div class="admin-users__table-actions">
                  <button class="admin-users__action-btn admin-users__action-btn--edit" @click="editUser(user)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="admin-users__action-btn admin-users__action-btn--delete"
                    @click="confirmDeleteUser(user)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de edición/creación -->
    <div v-if="showEditModal" class="admin-users__modal-overlay" @click="handleOverlayClick">
      <div class="admin-users__modal" @click.stop>
        <div class="admin-users__modal-header">
          <h2 class="admin-users__modal-title">
            {{ isCreating ? 'Crear Usuario' : 'Editar Usuario' }}
          </h2>
          <button class="admin-users__modal-close" @click="cancelEdit">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-users__modal-body">
          <form class="admin-users__form" @submit.prevent="saveUser">
            <div class="admin-users__form-grid">
              <!-- Campo ID solo en edición -->
              <div v-if="!isCreating" class="admin-users__form-group">
                <label class="admin-users__form-label">ID</label>
                <input class="admin-users__form-input" :value="editingUser?.id" disabled readonly />
              </div>

              <!-- Campo Nombre -->
              <div class="admin-users__form-group" :class="{ 'admin-users__form-group--full': isCreating }">
                <label class="admin-users__form-label">
                  Nombre <span class="admin-users__form-required">*</span>
                </label>
                <input v-model="editingUser.nombre" class="admin-users__form-input"
                  :class="{ 'admin-users__form-input--error': validationErrors.nombre }"
                  placeholder="Nombre completo del usuario" required />
                <div v-if="validationErrors.nombre" class="admin-users__form-error">
                  {{ validationErrors.nombre }}
                </div>
              </div>

              <!-- Campo Email -->
              <div class="admin-users__form-group" :class="{ 'admin-users__form-group--full': isCreating }">
                <label class="admin-users__form-label">
                  Email <span class="admin-users__form-required">*</span>
                </label>
                <input v-model="editingUser.email" type="email" class="admin-users__form-input"
                  :class="{ 'admin-users__form-input--error': validationErrors.email }" placeholder="correo@ejemplo.com"
                  required />
                <div v-if="validationErrors.email" class="admin-users__form-error">
                  {{ validationErrors.email }}
                </div>
              </div>

              <!-- Campo Contraseña (solo para crear) -->
              <div v-if="isCreating" class="admin-users__form-group admin-users__form-group--full">
                <label class="admin-users__form-label">
                  Contraseña <span class="admin-users__form-required">*</span>
                </label>
                <input v-model="editingUser.password" type="password" class="admin-users__form-input"
                  :class="{ 'admin-users__form-input--error': validationErrors.password }"
                  placeholder="Mínimo 6 caracteres" required />
                <div v-if="validationErrors.password" class="admin-users__form-error">
                  {{ validationErrors.password }}
                </div>
              </div>

              <!-- Campo Rol -->
              <div class="admin-users__form-group">
                <label class="admin-users__form-label">Rol</label>
                <div class="admin-users__form-radio-group">
                  <label class="admin-users__form-radio">
                    <input type="radio" v-model="editingUser.esAdmin" :value="false" name="rol">
                    <span>Usuario</span>
                  </label>
                  <label class="admin-users__form-radio">
                    <input type="radio" v-model="editingUser.esAdmin" :value="true" name="rol">
                    <span>Administrador</span>
                  </label>
                </div>
              </div>

              <!-- Campo Teléfono -->
              <div class="admin-users__form-group">
                <label class="admin-users__form-label">Teléfono</label>
                <input v-model="editingUser.telefono" type="tel" class="admin-users__form-input"
                  placeholder="+34 123 456 789" />
              </div>

              <!-- Campo Dirección -->
              <div class="admin-users__form-group admin-users__form-group--full">
                <label class="admin-users__form-label">Dirección</label>
                <textarea v-model="editingUser.direccion" class="admin-users__form-textarea" rows="3"
                  placeholder="Dirección completa del usuario"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="admin-users__modal-footer">
          <button class="admin-users__modal-btn admin-users__modal-btn--secondary" @click="cancelEdit"
            :disabled="loading">
            Cancelar
          </button>
          <button class="admin-users__modal-btn admin-users__modal-btn--primary" @click="saveUser"
            :disabled="loading || !isFormValid">
            <i v-if="loading" class="admin-users__spinner"></i>
            {{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear' : 'Guardar') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteModal" class="admin-users__modal-overlay" @click="cancelDelete">
      <div class="admin-users__modal admin-users__modal--small" @click.stop>
        <div class="admin-users__modal-header">
          <h2 class="admin-users__modal-title">Confirmar Eliminación</h2>
          <button class="admin-users__modal-close" @click="cancelDelete">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-users__modal-body">
          <div class="admin-users__confirm">
            <i class="fas fa-exclamation-triangle admin-users__confirm-icon"></i>
            <p class="admin-users__confirm-text">
              ¿Eliminar a <strong>{{ userToDelete?.nombre }}</strong>?
              <br>Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div class="admin-users__modal-footer">
          <button class="admin-users__modal-btn admin-users__modal-btn--secondary" @click="cancelDelete"
            :disabled="loading">
            Cancelar
          </button>
          <button class="admin-users__modal-btn admin-users__modal-btn--danger" @click="deleteUser" :disabled="loading">
            <i v-if="loading" class="admin-users__spinner"></i>
            {{ loading ? 'Eliminando...' : 'Eliminar' }}
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

interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  esAdmin: boolean;
  fechaRegistro?: string;
  telefono?: string;
  direccion?: string;
  password?: string; // Solo para creación
}

const adminStore = useAdminStore();
const toast = useToast();

// Estado reactivo
const searchQuery = ref('');
const loading = ref(false);
const editingUser = ref<Usuario>({
  nombre: '',
  email: '',
  esAdmin: false,
  telefono: '',
  direccion: '',
  password: ''
});
const userToDelete = ref<Usuario | null>(null);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const validationErrors = ref<Record<string, string>>({});

// Computadas
const isCreating = computed(() => !editingUser.value?.id);

const isFormValid = computed(() => {
  if (!editingUser.value) return false;

  const hasName = editingUser.value.nombre?.trim();
  const hasEmail = editingUser.value.email?.trim();
  const hasPassword = isCreating.value ? editingUser.value.password?.trim() : true;

  return hasName && hasEmail && hasPassword && Object.keys(validationErrors.value).length === 0;
});

const filteredUsers = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return adminStore.users;

  return adminStore.users.filter(user =>
    user.nombre.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    String(user.id).includes(query)
  );
});

// Watchers para validación en tiempo real
watch(() => editingUser.value.nombre, (newValue) => {
  if (validationErrors.value.nombre && newValue?.trim()) {
    delete validationErrors.value.nombre;
  }
});

watch(() => editingUser.value.email, (newValue) => {
  if (validationErrors.value.email && newValue?.trim()) {
    delete validationErrors.value.email;
  }
});

watch(() => editingUser.value.password, (newValue) => {
  if (validationErrors.value.password && newValue?.trim()) {
    delete validationErrors.value.password;
  }
});

// Métodos
const validateUser = (): boolean => {
  validationErrors.value = {};

  if (!editingUser.value) return false;

  // Validar nombre
  if (!editingUser.value.nombre?.trim()) {
    validationErrors.value.nombre = 'El nombre es obligatorio';
  }

  // Validar email
  if (!editingUser.value.email?.trim()) {
    validationErrors.value.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.value.email)) {
    validationErrors.value.email = 'El email no tiene un formato válido';
  }

  // Validar contraseña solo en creación
  if (isCreating.value) {
    if (!editingUser.value.password?.trim()) {
      validationErrors.value.password = 'La contraseña es obligatoria';
    } else if (editingUser.value.password.length < 6) {
      validationErrors.value.password = 'La contraseña debe tener al menos 6 caracteres';
    }
  }

  return Object.keys(validationErrors.value).length === 0;
};

const resetForm = () => {
  editingUser.value = {
    nombre: '',
    email: '',
    esAdmin: false,
    telefono: '',
    direccion: '',
    password: ''
  };
  validationErrors.value = {};
};

const createUser = () => {
  console.log('Creando nuevo usuario...');
  resetForm();
  showEditModal.value = true;
};

const editUser = (user: Usuario) => {
  console.log('Editando usuario:', user);

  // Crear una copia profunda del usuario
  editingUser.value = {
    id: user.id,
    nombre: user.nombre || '',
    email: user.email || '',
    esAdmin: user.esAdmin || false,
    telefono: user.telefono || '',
    direccion: user.direccion || '',
    fechaRegistro: user.fechaRegistro
  };

  validationErrors.value = {};
  showEditModal.value = true;

  console.log('Usuario para editar:', editingUser.value);
};

const handleOverlayClick = () => {
  cancelEdit();
};

const cancelEdit = () => {
  console.log('Cancelando edición...');
  showEditModal.value = false;
  resetForm();
};

const saveUser = async () => {
  console.log('Guardando usuario...', editingUser.value);
  
  if (!editingUser.value) {
    toast.error('No hay datos de usuario para guardar');
    return;
  }

  if (!validateUser()) {
    toast.error('Por favor, corrija los errores del formulario');
    return;
  }

  loading.value = true;
  
  try {
    if (isCreating.value) {
      // Crear nuevo usuario
      console.log('Creando usuario:', editingUser.value);
      
      const userData = {
        nombre: editingUser.value.nombre.trim(),
        email: editingUser.value.email.trim(),
        password: editingUser.value.password!,
        esAdmin: editingUser.value.esAdmin,
        telefono: editingUser.value.telefono?.trim() || '',
        direccion: editingUser.value.direccion?.trim() || ''
      };
      
      await adminStore.createUser(userData);
      
      // SOLUCIÓN: Recargar todos los usuarios después de crear
      console.log('Recargando lista de usuarios después de crear...');
      await adminStore.fetchAllUsers();
      
      toast.success('Usuario creado correctamente');
    } else {
      // Actualizar usuario existente
      console.log('Actualizando usuario:', editingUser.value);
      
      const userData = {
        id: editingUser.value.id!,
        nombre: editingUser.value.nombre.trim(),
        email: editingUser.value.email.trim(),
        esAdmin: editingUser.value.esAdmin,
        telefono: editingUser.value.telefono?.trim() || '',
        direccion: editingUser.value.direccion?.trim() || '',
        fechaRegistro: editingUser.value.fechaRegistro
      };
      
      await adminStore.updateUser(userData);
      
      // SOLUCIÓN: Recargar todos los usuarios para asegurar sincronización
      console.log('Recargando lista de usuarios...');
      await adminStore.fetchAllUsers();
      
      toast.success('Usuario actualizado correctamente');
    }
    
    // Cerrar modal y limpiar formulario
    showEditModal.value = false;
    resetForm();
    
    console.log('Operación completada. Total usuarios:', adminStore.users.length);
    
  } catch (error: any) {
    console.error('Error al guardar usuario:', error);
    toast.error(error.message || 'Error al guardar usuario');
  } finally {
    loading.value = false;
  }
};

const confirmDeleteUser = (user: Usuario) => {
  console.log('Confirmando eliminación de usuario:', user);
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  console.log('Cancelando eliminación');
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const deleteUser = async () => {
  console.log('Eliminando usuario...', userToDelete.value);
  
  if (!userToDelete.value?.id) {
    toast.error('No hay usuario seleccionado para eliminar');
    return;
  }

  loading.value = true;

  try {
    await adminStore.deleteUser(userToDelete.value.id);
    
    // SOLUCIÓN: Recargar todos los usuarios después de eliminar
    console.log('Recargando lista de usuarios después de eliminar...');
    await adminStore.fetchAllUsers();
    
    toast.success('Usuario eliminado correctamente');
    showDeleteModal.value = false;
    userToDelete.value = null;
    
    console.log('Eliminación completada. Total usuarios:', adminStore.users.length);
    
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    toast.error(error.message || 'Error al eliminar usuario');
  } finally {
    loading.value = false;
  }
};

// Ciclo de vida
onMounted(async () => {
  console.log('Montando AdminUsers...');

  // Configurar el token de autenticación
  const token = localStorage.getItem('token');
  if (token) {
    adminStore.setAuthToken(token);
  }

  // Cargar usuarios si no están ya cargados
  if (adminStore.users.length === 0) {
    console.log('Cargando usuarios...');
    await adminStore.fetchAllUsers();
  }

  console.log('Usuarios cargados:', adminStore.users.length);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-users {
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

 // Loading state
 &__loading {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: $spacing-xl;
   text-align: center;
   
   p {
     margin-top: $spacing-md;
     color: $text-color-secondary;
   }
 }

 // Header móvil optimizado
 &__header {
   display: flex;
   flex-direction: column;
   gap: $spacing-sm;
   margin-bottom: $spacing-lg;
   
   @media (min-width: $breakpoint-sm) {
     flex-direction: row;
     align-items: center;
     justify-content: space-between;
   }
 }

 &__title {
   font-size: $font-size-xl;
   font-weight: $font-weight-bold;
   color: $text-color;
   margin: 0;
   font-family: $font-family-primary;
   
   @media (min-width: $breakpoint-md) {
     font-size: $font-size-xxl;
   }
 }

 &__search {
   position: relative;
   flex: 1;
   max-width: 100%;
   
   @media (min-width: $breakpoint-sm) {
     max-width: 300px;
   }
 }

 &__search-input {
   width: 100%;
   padding: $spacing-sm $spacing-xl $spacing-sm $spacing-sm;
   border: 1px solid $border-color;
   border-radius: $border-radius;
   font-size: $font-size-base;
   
   &:focus {
     outline: none;
     border-color: $primary-color;
     box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
   }
 }

 &__search-icon {
   position: absolute;
   right: $spacing-sm;
   top: 50%;
   transform: translateY(-50%);
   color: $text-color-secondary;
 }

 &__create-btn {
   display: flex;
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
   
   @media (max-width: $breakpoint-sm - 1px) {
     width: 50px;
     justify-content: center;
   }
 }

 &__create-btn-text {
   @media (max-width: $breakpoint-sm - 1px) {
     display: none;
   }
 }

 // Lista móvil (cards)
 &__mobile-list {
   display: block;
   
   @media (min-width: $breakpoint-md) {
     display: none;
   }
 }

 &__empty {
   text-align: center;
   padding: $spacing-xl;
   color: $text-color-secondary;
   background: white;
   border-radius: $border-radius-lg;
   box-shadow: $box-shadow;
   
   i {
     font-size: 3rem;
     margin-bottom: $spacing-md;
     opacity: 0.5;
   }
 }

 &__card {
   background: white;
   border-radius: $border-radius-lg;
   box-shadow: $box-shadow;
   margin-bottom: $spacing-md;
   overflow: hidden;
   transition: transform $transition-fast, box-shadow $transition-fast;
   
   &:hover {
     transform: translateY(-2px);
     box-shadow: $box-shadow-lg;
   }
 }

 &__card-header {
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: $spacing-md $spacing-md $spacing-sm;
   border-bottom: 1px solid $tertiary-color;
 }

 &__card-id {
   font-weight: $font-weight-bold;
   color: $text-color-secondary;
   font-size: $font-size-small;
 }

 &__card-body {
   padding: $spacing-md;
 }

 &__card-name {
   font-size: $font-size-large;
   font-weight: $font-weight-semibold;
   color: $text-color;
   margin: 0 0 $spacing-xs;
 }

 &__card-email,
 &__card-phone {
   color: $text-color-secondary;
   margin: 0 0 $spacing-sm;
   font-size: $font-size-small;
   display: flex;
   align-items: center;
   gap: $spacing-xs;
 }

 &__card-actions {
   display: flex;
   justify-content: flex-end;
   gap: $spacing-sm;
   padding: $spacing-sm $spacing-md $spacing-md;
 }

 // Vista desktop (tabla)
 &__desktop-table {
   display: none;
   
   @media (min-width: $breakpoint-md) {
     display: block;
     background: white;
     border-radius: $border-radius-lg;
     box-shadow: $box-shadow;
     overflow: hidden;
   }
 }

 &__table {
   width: 100%;
   border-collapse: collapse;
 }

 &__table-head {
   background: $tertiary-color;
   
   th {
     padding: $spacing-md;
     text-align: left;
     font-weight: $font-weight-semibold;
     color: $text-color;
     border-bottom: 1px solid $border-color;
   }
 }

 &__table-row {
   transition: background-color $transition-fast;
   
   &:hover {
     background: rgba($primary-color, 0.05);
   }
 }

 &__table-cell {
   padding: $spacing-md;
   border-bottom: 1px solid $tertiary-color;
   vertical-align: middle;
 }

 &__table-actions {
   display: flex;
   gap: $spacing-xs;
 }

 // Role badge
 &__role-badge {
   display: inline-block;
   padding: $spacing-xs $spacing-sm;
   border-radius: $border-radius-pill;
   font-size: $font-size-small;
   font-weight: $font-weight-medium;
   background: rgba($info-color, 0.1);
   color: $info-color;
   
   &--admin {
     background: rgba($primary-color, 0.1);
     color: $primary-color;
   }
 }

 // Action buttons
 &__action-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 32px;
   height: 32px;
   border: none;
   border-radius: $border-radius;
   cursor: pointer;
   transition: all $transition-fast;
   
   &--edit {
     background: rgba($primary-color, 0.1);
     color: $primary-color;
     
     &:hover {
       background: $primary-color;
       color: white;
     }
   }
   
   &--delete {
     background: rgba($error-color, 0.1);
     color: $error-color;
     
     &:hover {
       background: $error-color;
       color: white;
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

 &__form-radio-group {
   display: flex;
   flex-direction: column;
   gap: $spacing-xs;
   margin-top: $spacing-xs;
   
   @media (min-width: $breakpoint-sm) {
     flex-direction: row;
     gap: $spacing-md;
   }
 }

 &__form-radio {
   display: flex;
   align-items: center;
   gap: $spacing-xs;
   cursor: pointer;
   padding: $spacing-xs;
   border-radius: $border-radius;
   transition: background-color $transition-fast;
   
   &:hover {
     background: rgba($primary-color, 0.05);
   }
   
   input[type="radio"] {
     margin: 0;
     cursor: pointer;
   }
   
   span {
     font-size: $font-size-base;
     color: $text-color;
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
   min-width: 80px;
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
   
   .admin-users__modal-btn--secondary & {
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
}
</style>