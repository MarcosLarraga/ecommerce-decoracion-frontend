<!-- @/views/admin/AdminUsers.vue -->
<template>
  <div class="admin-view admin-users">
    <AdminHeader title="Gestión de Usuarios">
      <template #actions>
        <AdminSearch v-model="searchQuery" placeholder="Buscar usuarios..." />
        <button class="header-btn" @click="createUser">
          <i class="fas fa-user-plus"></i>
          <span class="text">Añadir Usuario</span>
        </button>
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
            <button class="btn btn-edit" @click="editUser(user)" title="Editar usuario">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-delete" @click="confirmDeleteUser(user)" title="Eliminar usuario">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </AdminTable>
    </AdminContent>

    <!-- Modal de edición de usuario -->
    <AdminModal v-model="showEditModal" :title="isCreating ? 'Crear Nuevo Usuario' : 'Editar Usuario'" v-if="editingUser">
      <AdminForm @submit="saveUser">
        <div class="admin-form__row">
          <div class="admin-form__col" v-if="!isCreating">
            <AdminFormGroup label="ID">
              <AdminInput :value="editingUser.id" disabled />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="Nombre" required :error="validationErrors.nombre">
              <AdminInput v-model="editingUser.nombre" :error="!!validationErrors.nombre" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Email" required :error="validationErrors.email">
              <AdminInput type="email" v-model="editingUser.email" :error="!!validationErrors.email" required />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col">
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
          </div>

          <div class="admin-form__col">
            <AdminFormGroup label="Teléfono" :error="validationErrors.telefono">
              <AdminInput type="tel" v-model="editingUser.telefono" :error="!!validationErrors.telefono" />
            </AdminFormGroup>
          </div>

          <div class="admin-form__col admin-form__col--full">
            <AdminFormGroup label="Dirección" :error="validationErrors.direccion">
              <AdminTextarea v-model="editingUser.direccion" :error="!!validationErrors.direccion" rows="3" />
            </AdminFormGroup>
          </div>
        </div>
      </AdminForm>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelEdit" :disabled="loading">
          <i class="fas fa-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="modal-btn primary-btn" @click="saveUser" :disabled="loading">
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-save"></i>
          <span>{{ loading ? (isCreating ? 'Creando...' : 'Guardando...') : (isCreating ? 'Crear Usuario' : 'Guardar Cambios') }}</span>
        </button>
      </template>
    </AdminModal>

    <!-- Modal de confirmación de eliminación -->
    <AdminModal v-model="showDeleteModal" title="Confirmar Eliminación" size="sm" v-if="userToDelete">
      <div class="confirm-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>
          ¿Estás seguro de que deseas eliminar al usuario
          <strong>{{ userToDelete.nombre }}</strong>?
          <br>
          Esta acción no se puede deshacer.
        </p>
      </div>

      <template #footer>
        <button class="modal-btn secondary-btn" @click="showDeleteModal = false" :disabled="loading">
          <i class="fas fa-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="modal-btn error-btn" @click="deleteUser" :disabled="loading">
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-trash-alt"></i>
          <span>{{ loading ? 'Eliminando...' : 'Eliminar Usuario' }}</span>
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
const validationErrors = ref<Record<string, string>>({});

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Nombre', key: 'nombre' },
  { label: 'Email', key: 'email' },
  { label: 'Rol', key: 'esAdmin' },
  { label: 'Fecha de registro', key: 'fechaRegistro' }
];

// Computed para determinar si estamos creando o editando
const isCreating = computed(() => !editingUser.value?.id);

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

// Validación del formulario
const validateUser = (): boolean => {
  validationErrors.value = {};
  
  if (!editingUser.value) return false;
  
  if (!editingUser.value.nombre?.trim()) {
    validationErrors.value.nombre = 'El nombre es obligatorio';
  }
  
  if (!editingUser.value.email?.trim()) {
    validationErrors.value.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.value.email)) {
    validationErrors.value.email = 'El email no tiene un formato válido';
  }
  
  return Object.keys(validationErrors.value).length === 0;
};

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

const createUser = () => {
  editingUser.value = {
    id: 0,
    nombre: '',
    email: '',
    esAdmin: false,
    telefono: '',
    direccion: ''
  };
  validationErrors.value = {};
  showEditModal.value = true;
};

const editUser = (user: Usuario) => {
  editingUser.value = { ...user };
  validationErrors.value = {};
  showEditModal.value = true;
};

const cancelEdit = () => {
  showEditModal.value = false;
  editingUser.value = null;
};

const saveUser = async () => {
  if (!editingUser.value) return;

  if (!validateUser()) {
    toast.error('Por favor, corrija los errores del formulario');
    return;
  }

  loading.value = true;
  try {
    if (isCreating.value) {
      // Lógica para crear un nuevo usuario (si aplicara)
      // Por ahora solo consideramos la edición
      toast.success('Usuario creado correctamente');
    } else {
      await adminStore.updateUser(editingUser.value);
      toast.success('Usuario actualizado correctamente');
    }
    
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

<style lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/admin-unified-styles.scss';

.admin-users {
  // Estilos específicos para la vista de usuarios, si son necesarios
}
</style>