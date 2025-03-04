<template>
  <div class="admin-panel">
    <h1 class="admin-panel__title">Panel de Administración</h1>

    <!-- Pestañas (Usuarios, Productos, Pedidos) -->
    <div class="admin-panel__tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="admin-panel__tab-btn"
        :class="{ 'admin-panel__tab-btn--active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- SECCIÓN USUARIOS -->
    <div v-if="activeTab === 'users'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">GESTIÓN DE USUARIOS</h2>
      <div class="users-table">
        <div class="users-table__container">
          <table class="users-table__content">
            <thead>
              <tr>
                <th class="users-table__header users-table__header--sticky">ID</th>
                <th class="users-table__header">Nombre</th>
                <th class="users-table__header">Email</th>
                <th class="users-table__header">Rol</th>
                <th class="users-table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="users-table__cell users-table__cell--sticky">{{ user.id }}</td>
                <td class="users-table__cell">{{ user.nombre }}</td>
                <td class="users-table__cell">{{ user.email }}</td>
                <td class="users-table__cell">{{ user.role }}</td>
                <td class="users-table__cell">
                  <button @click="openEditUserModal(user)" class="users-table__btn users-table__btn--edit">
                    Editar
                  </button>
                  <button @click="deleteUser(user.id)" class="users-table__btn users-table__btn--delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SECCIÓN PRODUCTOS -->
    <div v-if="activeTab === 'products'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">GESTIÓN DE PRODUCTOS</h2>
      <button @click="showAddProductForm = true" class="admin-panel__add-btn">Añadir Producto</button>
      <div class="users-table">
        <div class="users-table__container">
          <table class="users-table__content">
            <thead>
              <tr>
                <th class="users-table__header users-table__header--sticky">ID</th>
                <th class="users-table__header">Nombre</th>
                <th class="users-table__header">Precio</th>
                <th class="users-table__header">Categoría</th>
                <th class="users-table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td class="users-table__cell users-table__cell--sticky">{{ product.id }}</td>
                <td class="users-table__cell">{{ product.nombre }}</td>
                <td class="users-table__cell">{{ product.precio.toFixed(2) }}€</td>
                <td class="users-table__cell">{{ product.categoria }}</td>
                <td class="users-table__cell">
                  <button @click="openEditProductModal(product)" class="users-table__btn users-table__btn--edit">
                    Editar
                  </button>
                  <button @click="deleteProduct(product.id)" class="users-table__btn users-table__btn--delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SECCIÓN PEDIDOS (solo "Eliminar") -->
    <div v-if="activeTab === 'orders'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">GESTIÓN DE PEDIDOS</h2>
      <div class="users-table">
        <div class="users-table__container">
          <table class="users-table__content">
            <thead>
              <tr>
                <th class="users-table__header users-table__header--sticky">ID</th>
                <th class="users-table__header">Usuario ID</th>
                <th class="users-table__header">Fecha</th>
                <th class="users-table__header">Total</th>
                <th class="users-table__header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="users-table__cell users-table__cell--sticky">{{ order.id }}</td>
                <td class="users-table__cell">{{ order.usuarioId }}</td>
                <td class="users-table__cell">{{ formatDate(order.FechaPedido) }}</td>
                <td class="users-table__cell">
                  {{ order.total ? `${order.total.toFixed(2)}€` : '0€' }}
                </td>
                <td class="users-table__cell">
                  <button @click="deleteOrder(order.id)" class="users-table__btn users-table__btn--delete">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Formulario para añadir producto -->
    <div v-if="showAddProductForm" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">Añadir Producto</h2>
      <!-- Formulario para crear un nuevo producto... -->
      <p>Aquí va el formulario de creación de producto</p>
      <button @click="showAddProductForm = false" class="admin-panel__add-btn">Cerrar</button>
    </div>

    <!-- Modal de Edición de Usuario -->
    <div v-if="editingUser" class="modal-overlay">
      <div class="modal-content">
        <h3>Editar Usuario</h3>
        <label>
          ID:
          <input type="text" v-model="editingUser.id" disabled />
        </label>
        <label>
          Nombre:
          <input type="text" v-model="editingUser.nombre" />
        </label>
        <label>
          Email:
          <input type="email" v-model="editingUser.email" />
        </label>
        <div class="modal-buttons">
          <button @click="saveUserEdits" class="admin-panel__action-btn">Guardar</button>
          <button @click="cancelUserEdit" class="admin-panel__action-btn admin-panel__action-btn--danger">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edición de Producto -->
    <div v-if="editingProduct" class="modal-overlay">
      <div class="modal-content">
        <h3>Editar Producto</h3>
        <label>
          ID:
          <input type="text" v-model="editingProduct.id" disabled />
        </label>
        <label>
          Nombre:
          <input type="text" v-model="editingProduct.nombre" />
        </label>
        <label>
          Precio:
          <input type="number" step="0.01" v-model.number="editingProduct.precio" />
        </label>
        <label>
          Categoría:
          <input type="text" v-model="editingProduct.categoria" />
        </label>
        <div class="modal-buttons">
          <button @click="saveProductEdits" class="admin-panel__action-btn">Guardar</button>
          <button @click="cancelProductEdit" class="admin-panel__action-btn admin-panel__action-btn--danger">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const adminStore = useAdminStore();
const toast = useToast();

const activeTab = ref('users');
const users = ref<any[]>([]);
const products = ref<any[]>([]);
const orders = ref<any[]>([]);
const showAddProductForm = ref(false);

// Variables reactivas para modales (Usuario y Producto)
const editingUser = ref<any>(null);
const editingProduct = ref<any>(null);

const tabs = [
  { id: 'users', name: 'Usuarios' },
  { id: 'products', name: 'Productos' },
  { id: 'orders', name: 'Pedidos' }
];

// Función para formatear fechas en formato local
function formatDate(dateString: string): string {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? 'Fecha inválida'
    : date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

onMounted(async () => {
  try {
    await adminStore.fetchAllUsers();
    await adminStore.fetchAllProducts();
    await adminStore.fetchAllOrders();

    users.value = adminStore.users;
    products.value = adminStore.products;
    orders.value = adminStore.orders;
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

/* USUARIOS */
function openEditUserModal(user: any) {
  editingUser.value = { ...user };
}
async function saveUserEdits() {
  if (editingUser.value) {
    await adminStore.updateUser(editingUser.value);
    await adminStore.fetchAllUsers();
    users.value = adminStore.users;
    editingUser.value = null;
    toast.success("Usuario actualizado correctamente");
    location.reload();
  }
}
function cancelUserEdit() {
  editingUser.value = null;
}
async function deleteUser(userId: number) {
  try {
    await adminStore.deleteUser(userId);
    toast.success("Usuario eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    toast.error("Error al eliminar usuario");
  }
}

/* PRODUCTOS */
function openEditProductModal(product: any) {
  editingProduct.value = { ...product };
}
async function saveProductEdits() {
  if (editingProduct.value) {
    await adminStore.updateProduct(editingProduct.value);
    await adminStore.fetchAllProducts();
    products.value = adminStore.products;
    editingProduct.value = null;
    toast.success("Producto actualizado correctamente");
    location.reload();
  }
}
function cancelProductEdit() {
  editingProduct.value = null;
}
async function deleteProduct(productId: number) {
  try {
    await adminStore.deleteProduct(productId);
    toast.success("Producto eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    toast.error("Error al eliminar producto");
  }
}

/* PEDIDOS */
async function deleteOrder(orderId: number) {
  try {
    await adminStore.deleteOrder(orderId);
    toast.success("Pedido eliminado correctamente");
    location.reload();
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    toast.error("Error al eliminar pedido");
  }
}
</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

/* Contenedor principal del Admin Panel */
.admin-panel {
  width: 100%;
  max-width: $container-width;
  margin: $spacing-lg auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  @media (min-width: $breakpoint-md) {
    margin: $spacing-xl auto;
    padding: $spacing-lg;
  }

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin-bottom: $spacing-md;
    color: $primary-color;
    text-align: center;
    font-weight: $font-weight-bold;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xl;
      margin-bottom: $spacing-lg;
    }
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    border-bottom: $border-width solid $tertiary-color;
    margin-bottom: $spacing-md;

    @media (min-width: $breakpoint-md) {
      flex-wrap: nowrap;
      margin-bottom: $spacing-lg;
    }
  }

  &__tab-btn {
    flex: 1 0 50%;
    padding: $spacing-sm;
    background: none;
    border: none;
    font-family: $font-family-primary;
    font-size: $font-size-small;
    color: $text-color-secondary;
    cursor: pointer;
    position: relative;
    transition: color $transition-normal;

    @media (min-width: $breakpoint-md) {
      flex: 1;
      font-size: $font-size-base;
      padding: $spacing-sm $spacing-md;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -$border-width;
      left: 0;
      width: 0;
      height: $border-width-md;
      background-color: $primary-color;
      transition: width $transition-normal;
    }

    &:hover {
      color: $text-color;
    }

    &--active {
      color: $primary-color;
      font-weight: $font-weight-semibold;

      &::after {
        width: 100%;
      }
    }
  }

  &__section {
    padding: $spacing-md 0;
  }

  &__subtitle {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin: $spacing-md 0;
    color: $primary-color;
    font-weight: $font-weight-semibold;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xl;
      margin: $spacing-lg 0 $spacing-md;
    }
  }

  &__add-btn {
    padding: $spacing-sm;
    background-color: $success-color;
    color: $button-text-color;
    border: none;
    border-radius: $button-radius;
    cursor: pointer;
    transition: background-color $transition-fast;
    margin-bottom: $spacing-md;
    width: 100%;
    font-size: $font-size-base;

    @media (min-width: $breakpoint-md) {
      width: auto;
      padding: $spacing-sm $spacing-md;
    }

    &:hover {
      background-color: darken($success-color, 10%);
    }
  }

  &__action-btn {
    padding: $spacing-xs;
    margin-right: $spacing-xs;
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    border-radius: $button-radius-sm;
    cursor: pointer;
    transition: background-color $transition-fast;
    font-size: $font-size-small;

    @media (min-width: $breakpoint-md) {
      padding: $spacing-xs $spacing-sm;
      font-size: $font-size-base;
    }

    &:hover {
      background-color: $primary-color-hover;
    }

    &--danger {
      background-color: $error-color;

      &:hover {
        background-color: darken($error-color, 10%);
      }
    }
  }
}

/* 
  Usamos la misma clase .users-table para las TRES secciones,
  así todos tienen el mismo maquetado (sticky en la primera columna, 
  color de cabecera, etc.).
*/
.users-table {
  width: 100%;
  overflow-x: auto;
  /* Scroll horizontal en móvil */
  -webkit-overflow-scrolling: touch;

  &__container {
    min-width: 100%;
    padding-bottom: $spacing-sm;
  }

  &__content {
    width: 100%;
    border-collapse: collapse;
  }

  &__header,
  &__cell {
    padding: $spacing-sm;
    text-align: left;
    white-space: nowrap;

    &--sticky {
      position: sticky;
      left: 0;
      background-color: $background-color;
      /* Fijamos el color de fondo */
      z-index: $z-index-sticky;
    }
  }

  &__header {
    background-color: $primary-color;
    color: $button-text-color;
    font-weight: $font-weight-bold;
  }

  &__cell {
    border-bottom: $border-width solid $border-color;
  }

  &__btn {
    padding: $spacing-xs $spacing-sm;
    border: none;
    border-radius: $button-radius-sm;
    font-size: $font-size-small;
    cursor: pointer;
    transition: background-color $transition-fast;

    &--edit {
      background-color: $primary-color;
      color: $button-text-color;
      margin-right: $spacing-xs;

      &:hover {
        background-color: $primary-color-hover;
      }
    }

    &--delete {
      background-color: $error-color;
      color: $button-text-color;

      &:hover {
        background-color: darken($error-color, 10%);
      }
    }
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba($secondary-color, $opacity-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-modal;
}

.modal-content {
  background: $background-color;
  padding: $spacing-md;
  border-radius: $border-radius;
  width: 90%;
  max-width: 500px;

  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: $spacing-md;
}

.modal-buttons button {
  margin-left: $spacing-xs;
}
</style>
