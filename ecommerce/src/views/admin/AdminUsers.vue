<!-- @/views/admin/AdminUsers.vue con botones nativos -->
<template>
  <div class="admin-users">
    <AdminHeader title="Gestión de Usuarios">
      <template #actions>
        <AdminSearch v-model="searchQuery" placeholder="Buscar usuarios..." />
      </template>
    </AdminHeader>

    <AdminContent>
      <AdminTable :columns="columns" :isEmpty="filteredUsers.length === 0"
        :emptyMessage="searchQuery ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'">
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>#{{ user.id }}</td>
          <td>{{ user.nombre }}</td>
          <td>{{ user.email }}</td>
          <td>
            <AdminBadge :type="user.esAdmin ? 'primary' : 'info'">
              {{ user.esAdmin ? 'Administrador' : 'Usuario' }}
            </AdminBadge>
          </td>
          <td>{{ formatDate(user.fechaRegistro) }}</td>
          <td class="action-buttons">
            <button class="btn-edit" @click="editUser(user)" title="Editar usuario">
              ✏️
            </button>
            <button class="btn-delete" @click="confirmDeleteUser(user)" title="Eliminar usuario">
              🗑️
            </button>
          </td>
        </tr>
      </AdminTable>
    </AdminContent>

    <!-- Modal de edición de usuario -->
    <AdminModal v-model="showEditModal" title="Editar Usuario" v-if="editingUser">
      <AdminForm @submit="saveUser">
        <AdminFormGroup label="ID">
          <AdminInput type="text" :value="editingUser.id" disabled />
        </AdminFormGroup>

        <AdminFormGroup label="Nombre">
          <AdminInput v-model="editingUser.nombre" />
        </AdminFormGroup>

        <AdminFormGroup label="Email">
          <AdminInput type="email" v-model="editingUser.email" />
        </AdminFormGroup>

        <AdminFormGroup label="Rol">
          <div class="admin-form__radio-group">
            <label class="admin-form__radio">
              <input type="radio" v-model="editingUser.esAdmin" :value="false">
              Usuario
            </label>
            <label class="admin-form__radio">
              <input type="radio" v-model="editingUser.esAdmin" :value="true">
              Administrador
            </label>
          </div>
        </AdminFormGroup>

        <AdminFormGroup label="Teléfono">
          <AdminInput type="tel" v-model="editingUser.telefono" />
        </AdminFormGroup>

        <AdminFormGroup label="Dirección">
          <AdminTextarea v-model="editingUser.direccion" rows="3" />
        </AdminFormGroup>
      </AdminForm>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="showEditModal = false">
          Cancelar
        </button>
        <button class="modal-btn primary-btn" @click="saveUser" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </template>
    </AdminModal>

    <!-- Modal de confirmación de eliminación -->
    <AdminModal v-model="showDeleteModal" title="Confirmar Eliminación" size="sm" v-if="userToDelete">
      <p class="admin-modal__message">
        ¿Estás seguro de que deseas eliminar al usuario
        <strong>{{ userToDelete.nombre }}</strong>?
        <br>
        Esta acción no se puede deshacer.
      </p>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="showDeleteModal = false">
          Cancelar
        </button>
        <button class="modal-btn error-btn" @click="deleteUser" :disabled="loading">
          {{ loading ? 'Eliminando...' : 'Eliminar Usuario' }}
        </button>
      </template>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { useToast } from 'vue-toastification';

// Importar componentes administrativos
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminSearch from '@/components/admin/AdminSearch.vue';
import AdminContent from '@/components/admin/AdminContent.vue';
import AdminTable from '@/components/admin/AdminTable.vue';
import AdminBadge from '@/components/admin/AdminBadge.vue';
import AdminModal from '@/components/admin/AdminModal.vue';
import AdminForm from '@/components/admin/AdminForm.vue';
import AdminFormGroup from '@/components/admin/AdminFormGroup.vue';
import AdminInput from '@/components/admin/AdminInput.vue';
import AdminTextarea from '@/components/admin/AdminTextarea.vue';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  esAdmin: boolean;
  fechaRegistro?: string;
  telefono?: string;
  direccion?: string;
}

const adminStore = useAdminStore();
const toast = useToast();

const searchQuery = ref('');
const loading = ref(false);
const editingUser = ref<Usuario | null>(null);
const userToDelete = ref<Usuario | null>(null);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Nombre', key: 'nombre' },
  { label: 'Email', key: 'email' },
  { label: 'Rol', key: 'esAdmin' },
  { label: 'Fecha de registro', key: 'fechaRegistro' }
];

onMounted(async () => {
  if (adminStore.users.length === 0) {
    await adminStore.fetchAllUsers();
  }
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

// Funciones
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

const editUser = (user: Usuario) => {
  editingUser.value = { ...user };
  showEditModal.value = true;
};

const saveUser = async () => {
  if (!editingUser.value) return;

  loading.value = true;
  try {
    await adminStore.updateUser(editingUser.value);
    toast.success('Usuario actualizado correctamente');
    showEditModal.value = false;
  } catch (error: any) {
    toast.error(error.message || 'Error al actualizar usuario');
  } finally {
    loading.value = false;
  }
};

const confirmDeleteUser = (user: Usuario) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;

  loading.value = true;
  try {
    await adminStore.deleteUser(userToDelete.value.id);
    toast.success('Usuario eliminado correctamente');
    showDeleteModal.value = false;
  } catch (error: any) {
    toast.error(error.message || 'Error al eliminar usuario');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
  }
  
  .btn-edit {
    background-color: $primary-color;
    color: white;
    
    &:hover {
      background-color: $primary-color-hover;
      transform: translateY(-2px);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    }
  }
  
  .btn-delete {
    background-color: $error-color;
    color: white;
    
    &:hover {
      background-color: $error-color-hover;
      transform: translateY(-2px);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
    }
  }
}

// Estilos de los botones en los modales
.modal-btn {
  padding: 8px 16px;
  border-radius: $border-radius;
  border: none;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.2s ease;
  
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
</style>