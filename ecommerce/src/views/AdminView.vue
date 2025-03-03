<template>
  <div class="admin-panel">
    <h1 class="admin-panel__title">Panel de Administración</h1>

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

    <!-- Usuarios -->
    <div v-if="activeTab === 'users'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">Gestión de Usuarios</h2>
      <table class="admin-panel__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.nombre }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="editUser(user)" class="admin-panel__action-btn">Editar</button>
              <button @click="deleteUser(user.id)" class="admin-panel__action-btn admin-panel__action-btn--danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Productos -->
    <div v-if="activeTab === 'products'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">Gestión de Productos</h2>
      <button @click="showAddProductForm = true" class="admin-panel__add-btn">Añadir Producto</button>
      <table class="admin-panel__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.nombre }}</td>
            <td>{{ product.precio }}€</td>
            <td>{{ product.categoria }}</td>
            <td>
              <button @click="editProduct(product)" class="admin-panel__action-btn">Editar</button>
              <button @click="deleteProduct(product.id)" class="admin-panel__action-btn admin-panel__action-btn--danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pedidos -->
    <div v-if="activeTab === 'orders'" class="admin-panel__section">
      <h2 class="admin-panel__subtitle">Gestión de Pedidos</h2>
      <table class="admin-panel__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.usuario }}</td>
            <td>{{ new Date(order.fecha).toLocaleString() }}</td>
            <td>{{ order.total }}€</td>
            <td>{{ order.estado }}</td>
            <td>
              <button @click="viewOrderDetails(order.id)" class="admin-panel__action-btn">Ver Detalles</button>
              <button @click="updateOrderStatus(order.id)" class="admin-panel__action-btn">Actualizar Estado</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const userStore = useUserStore();
const activeTab = ref('users');
const users = ref([]);
const products = ref([]);
const orders = ref([]);
const showAddProductForm = ref(false);

const tabs = [
  { id: 'users', name: 'Usuarios' },
  { id: 'products', name: 'Productos' },
  { id: 'orders', name: 'Pedidos' }
];

onMounted(async () => {
  if (!userStore.user?.role || userStore.user.role !== 'admin') {
    // Redirigir si no es admin
    router.push('/');
    return;
  }
  await fetchUsers();
  await fetchProducts();
  await fetchOrders();
});

async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:5162/api/usuarios', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function fetchProducts() {
  try {
    const response = await axios.get('http://localhost:5162/api/productos', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    products.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

async function fetchOrders() {
  try {
    const response = await axios.get('http://localhost:5162/api/pedidos', {
      headers: { Authorization: `Bearer ${userStore.token}` }
    });
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

// Implementar funciones para editar, eliminar usuarios, productos y gestionar pedidos
function editUser(user) {
  // Lógica para editar usuario
}

function deleteUser(userId) {
  // Lógica para eliminar usuario
}

function editProduct(product) {
  // Lógica para editar producto
}

function deleteProduct(productId) {
  // Lógica para eliminar producto
}

function viewOrderDetails(orderId) {
  // Lógica para ver detalles del pedido
}

function updateOrderStatus(orderId) {
  // Lógica para actualizar estado del pedido
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-panel {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
    color: $primary-color;
    text-align: center;
    font-weight: 700;
  }

  &__tabs {
    display: flex;
    border-bottom: 2px solid $tertiary-color;
    margin-bottom: $spacing-lg;
  }

  &__tab-btn {
    padding: $spacing-sm $spacing-md;
    background: none;
    border: none;
    font-family: $font-family-primary;
    font-size: $font-size-base;
    color: $text-color-secondary;
    cursor: pointer;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 3px;
      background-color: $primary-color;
      transition: width $transition-normal;
    }

    &:hover {
      color: $text-color;
    }

    &--active {
      color: $primary-color;
      font-weight: 600;

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
    margin: $spacing-lg 0 $spacing-md;
    color: $primary-color;
    font-weight: 600;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: $spacing-md;

    th, td {
      border: 1px solid $tertiary-color;
      padding: $spacing-sm;
      text-align: left;
    }

    th {
      background-color: $tertiary-color;
      font-weight: 600;
    }
  }

  &__action-btn {
    padding: $spacing-xs $spacing-sm;
    margin-right: $spacing-xs;
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    border-radius: $button-radius;
    cursor: pointer;
    transition: background-color $transition-fast;

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

  &__add-btn {
    padding: $spacing-sm $spacing-md;
    background-color: $success-color;
    color: $button-text-color;
    border: none;
    border-radius: $button-radius;
    cursor: pointer;
    transition: background-color $transition-fast;
    margin-bottom: $spacing-md;

    &:hover {
      background-color: darken($success-color, 10%);
    }
  }
}
</style>
