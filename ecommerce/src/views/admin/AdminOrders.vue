<!-- @/views/admin/AdminOrders.vue con botones nativos -->
<template>
  <div class="admin-orders">
    <AdminHeader title="Gestión de Pedidos">
      <template #actions>
        <AdminSearch 
          v-model="searchQuery" 
          placeholder="Buscar pedidos..."
        />
      </template>
    </AdminHeader>
    
    <AdminContent>
      <template #filters>
        <AdminFilter label="Filtrar por fecha:">
          <AdminSelect v-model="dateFilter">
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </AdminSelect>
        </AdminFilter>
        
        <AdminFilter label="Ordenar por:">
          <AdminSelect v-model="sortBy">
            <option value="date_desc">Fecha (más reciente primero)</option>
            <option value="date_asc">Fecha (más antigua primero)</option>
            <option value="total_desc">Total (mayor primero)</option>
            <option value="total_asc">Total (menor primero)</option>
          </AdminSelect>
        </AdminFilter>
      </template>
      
      <AdminTable 
        :columns="columns"
        :isEmpty="filteredOrders.length === 0"
        :emptyMessage="searchQuery || dateFilter !== 'all' ? 'No se encontraron pedidos con esos criterios' : 'No hay pedidos registrados'"
      >
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>#{{ order.id }}</td>
          <td>{{ getUserName(order.usuarioId) }}</td>
          <td>{{ order.fechaFormateada }}</td>
          <td>{{ formatCurrency(order.total) }}</td>
          <td>{{ getOrderProductsCount(order) }}</td>
          <td class="action-buttons">
            <button class="btn-view" @click="viewOrderDetails(order)" title="Ver detalles">
              👁️
            </button>
            <button class="btn-delete" @click="confirmDeleteOrder(order)" title="Eliminar pedido">
              🗑️
            </button>
          </td>
        </tr>
      </AdminTable>
    </AdminContent>
    
    <!-- Modal de detalles de pedido -->
    <AdminModal 
      v-model="showOrderDetails"
      :title="`Detalles del Pedido #${selectedOrder?.id || ''}`"
      size="lg"
      v-if="selectedOrder"
    >
      <div class="order-details">
        <div class="order-details__section">
          <h3 class="order-details__subtitle">Información del Pedido</h3>
          <div class="order-details__info">
            <div class="order-details__info-item">
              <span class="order-details__label">ID:</span>
              <span class="order-details__value">#{{ selectedOrder.id }}</span>
            </div>
            <div class="order-details__info-item">
              <span class="order-details__label">Fecha:</span>
              <span class="order-details__value">{{ selectedOrder.fechaFormateada }}</span>
            </div>
            <div class="order-details__info-item">
              <span class="order-details__label">Total:</span>
              <span class="order-details__value order-details__value--highlight">{{ formatCurrency(selectedOrder.total) }}</span>
            </div>
          </div>
        </div>
        
        <div class="order-details__section">
          <h3 class="order-details__subtitle">Cliente</h3>
          <div class="order-details__info">
            <div class="order-details__info-item">
              <span class="order-details__label">Nombre:</span>
              <span class="order-details__value">{{ getUserName(selectedOrder.usuarioId) }}</span>
            </div>
            <div class="order-details__info-item">
              <span class="order-details__label">Email:</span>
              <span class="order-details__value">{{ getUserEmail(selectedOrder.usuarioId) }}</span>
            </div>
            <div class="order-details__info-item" v-if="getUserPhone(selectedOrder.usuarioId)">
              <span class="order-details__label">Teléfono:</span>
              <span class="order-details__value">{{ getUserPhone(selectedOrder.usuarioId) }}</span>
            </div>
            <div class="order-details__info-item" v-if="getUserAddress(selectedOrder.usuarioId)">
              <span class="order-details__label">Dirección:</span>
              <span class="order-details__value">{{ getUserAddress(selectedOrder.usuarioId) }}</span>
            </div>
          </div>
        </div>
        
        <div class="order-details__section">
          <h3 class="order-details__subtitle">Productos</h3>
          <div class="order-details__products">
            <div v-if="loadingOrderDetails" class="order-details__loading">
              <div class="spinner"></div>
              <span>Cargando detalles...</span>
            </div>
            <table v-else class="order-details__table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in orderDetails" :key="item.id">
                  <td>
                    <div class="order-details__product">
                      <div class="order-details__product-image">
                        <img 
                          v-if="getProductImage(item.productoId)" 
                          :src="getProductImage(item.productoId)"
                          :alt="getProductName(item.productoId)"
                        >
                        <div v-else class="order-details__no-image">
                          📦
                        </div>
                      </div>
                      <div class="order-details__product-info">
                        <div class="order-details__product-name">
                          {{ getProductName(item.productoId) }}
                        </div>
                        <div class="order-details__product-id">
                          ID: {{ item.productoId }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ formatCurrency(item.precioUnitario) }}</td>
                  <td>{{ item.cantidad }}</td>
                  <td>{{ formatCurrency(item.precioUnitario * item.cantidad) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="order-details__total-label">
                    Total
                  </td>
                  <td class="order-details__total-value">
                    {{ formatCurrency(selectedOrder.total) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      
      <template #footer>
        <button class="modal-btn secondary-btn" @click="closeOrderDetails">
          Cerrar
        </button>
        <button class="modal-btn error-btn" @click="confirmDeleteOrder(selectedOrder)">
          Eliminar Pedido
        </button>
      </template>
    </AdminModal>
    
    <!-- Modal de confirmación de eliminación -->
    <AdminModal 
      v-model="showDeleteConfirmation"
      title="Confirmar Eliminación"
      size="sm"
      v-if="orderToDelete"
    >
      <p class="admin-modal__message">
        ¿Estás seguro de que deseas eliminar el pedido
        <strong>#{{ orderToDelete.id }}</strong>?
        <br>
        Esta acción no se puede deshacer.
      </p>
      
      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelDelete">
          Cancelar
        </button>
        <button 
          class="modal-btn error-btn" 
          @click="deleteOrder"
          :disabled="loading"
        >
          {{ loading ? 'Eliminando...' : 'Eliminar Pedido' }}
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
import AdminContent from '@/components/admin/AdminContent.vue';
import AdminFilter from '@/components/admin/AdminFilter.vue';
import AdminSelect from '@/components/admin/AdminSelect.vue';
import AdminTable from '@/components/admin/AdminTable.vue';
import AdminModal from '@/components/admin/AdminModal.vue';

interface DetallePedido {
  id: number;
  pedidoId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

interface Pedido {
  id: number;
  usuarioId: number;
  fechaPedido: string;
  fechaFormateada?: string;
  total: number;
  detalles?: DetallePedido[];
}

const adminStore = useAdminStore();
const toast = useToast();

const searchQuery = ref('');
const dateFilter = ref('all');
const sortBy = ref('date_desc');
const loading = ref(false);
const loadingOrderDetails = ref(false);
const selectedOrder = ref<Pedido | null>(null);
const orderToDelete = ref<Pedido | null>(null);
const orderDetails = ref<DetallePedido[]>([]);
const showOrderDetails = ref(false);
const showDeleteConfirmation = ref(false);

const columns = [
  { label: 'ID', key: 'id' },
  { label: 'Cliente', key: 'usuarioId' },
  { label: 'Fecha', key: 'fechaFormateada' },
  { label: 'Total', key: 'total' },
  { label: 'Productos', key: 'detalles' }
];

// Computed properties
const filteredOrders = computed(() => {
  let result = [...adminStore.orders];
  
  // Filtrar por texto de búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(order => 
      String(order.id).includes(query) ||
      String(order.usuarioId).includes(query) ||
      getUserName(order.usuarioId).toLowerCase().includes(query)
    );
  }
  
  // Filtrar por fecha
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  
  if (dateFilter.value !== 'all') {
    result = result.filter(order => {
      const orderDate = new Date(order.fechaPedido);
      
      switch (dateFilter.value) {
        case 'today':
          return orderDate >= today;
        case 'week':
          return orderDate >= startOfWeek;
        case 'month':
          return orderDate >= startOfMonth;
        case 'year':
          return orderDate >= startOfYear;
        default:
          return true;
      }
    });
  }
  
  // Ordenar resultados
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date_desc':
        return new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime();
      case 'date_asc':
        return new Date(a.fechaPedido).getTime() - new Date(b.fechaPedido).getTime();
      case 'total_desc':
        return b.total - a.total;
      case 'total_asc':
        return a.total - b.total;
      default:
        return 0;
    }
  });
  
  return result;
});

onMounted(async () => {
  // Cargar pedidos si no están ya cargados
  if (adminStore.orders.length === 0) {
    await adminStore.fetchAllOrders();
  }
  
  // Cargar usuarios si no están ya cargados
  if (adminStore.users.length === 0) {
    await adminStore.fetchAllUsers();
  }
  
  // Cargar productos si no están ya cargados
  if (adminStore.products.length === 0) {
    await adminStore.fetchAllProducts();
  }
});

// Funciones
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

const getUserName = (userId: number) => {
  const user = adminStore.getUserById(userId);
  return user ? user.nombre : `Usuario #${userId}`;
};

const getUserEmail = (userId: number) => {
  const user = adminStore.getUserById(userId);
  return user ? user.email : 'Email no disponible';
};

const getUserPhone = (userId: number) => {
  const user = adminStore.getUserById(userId);
  return user ? user.telefono : '';
};

const getUserAddress = (userId: number) => {
  const user = adminStore.getUserById(userId);
  return user ? user.direccion : '';
};

const getProductName = (productId: number) => {
  const product = adminStore.getProductById(productId);
  return product ? product.nombre : `Producto #${productId}`;
};

const getProductImage = (productId: number) => {
  const product = adminStore.getProductById(productId);
  return product ? product.urlImagen : '';
};

const getOrderProductsCount = (order: Pedido) => {
  if (order.detalles) {
    return order.detalles.length;
  }
  return 'N/A';
};

const viewOrderDetails = async (order: Pedido) => {
  selectedOrder.value = order;
  showOrderDetails.value = true;
  
  if (!order.detalles) {
    loadingOrderDetails.value = true;
    try {
      const orderWithDetails = await adminStore.getOrderDetails(order.id);
      if (orderWithDetails && orderWithDetails.detalles) {
        orderDetails.value = orderWithDetails.detalles;
      } else {
        orderDetails.value = [];
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Error al cargar los detalles del pedido');
      orderDetails.value = [];
    } finally {
      loadingOrderDetails.value = false;
    }
  } else {
    orderDetails.value = order.detalles;
  }
};

const closeOrderDetails = () => {
  showOrderDetails.value = false;
};

const confirmDeleteOrder = (order: Pedido) => {
  orderToDelete.value = order;
  showDeleteConfirmation.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmation.value = false;
};

const deleteOrder = async () => {
  if (!orderToDelete.value) return;
  
  loading.value = true;
  try {
    await adminStore.deleteOrder(orderToDelete.value.id);
    toast.success('Pedido eliminado correctamente');
    
    // Si el pedido eliminado es el que se está visualizando, cerrar el modal de detalles
    if (selectedOrder.value && selectedOrder.value.id === orderToDelete.value.id) {
      showOrderDetails.value = false;
    }
    
    showDeleteConfirmation.value = false;
  } catch (error: any) {
    toast.error(error.message || 'Error al eliminar pedido');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

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
  
  .btn-view {
    background-color: $info-color;
    color: white;
    
    &:hover {
      background-color: $info-color-hover;
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

// Spinner para estados de carga
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba($primary-color, 0.2);
  border-radius: 50%;
  border-top-color: $primary-color;
  animation: spin 1s linear infinite;
  margin-right: $spacing-sm;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.order-details {
  &__section {
    margin-bottom: $spacing-xl;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__subtitle {
    font-size: $font-size-large;
    font-weight: $font-weight-semibold;
    color: $text-color;
    margin: 0 0 $spacing-md 0;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid $border-color;
  }
  
  &__info {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: $spacing-md;
  }
  
  &__info-item {
    display: flex;
    align-items: center;
  }
  
  &__label {
    font-weight: $font-weight-medium;
    color: $text-color-secondary;
    margin-right: $spacing-xs;
    min-width: 80px;
  }
  
  &__value {
    color: $text-color;
    
    &--highlight {
      font-weight: $font-weight-semibold;
      color: $primary-color;
    }
  }
  
  &__products {
    margin-top: $spacing-md;
  }
  
  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    color: $text-color-secondary;
  }
  
  &__table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: $spacing-sm $spacing-md;
      text-align: left;
      border-bottom: 1px solid $border-color;
    }
    
    th {
      font-weight: $font-weight-semibold;
      color: $text-color;
      background-color: rgba($primary-color, 0.05);
    }
    
    td {
      color: $text-color-secondary;
    }
    
    tfoot {
      td {
        border-top: 2px solid $border-color;
        border-bottom: none;
        font-weight: $font-weight-semibold;
      }
      
      .order-details__total-label {
        text-align: right;
        color: $text-color;
      }
      
      .order-details__total-value {
        color: $primary-color;
        font-size: $font-size-large;
      }
    }
  }
  
  &__product {
    display: flex;
    align-items: center;
  }
  
  &__product-image {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: $border-radius-sm;
    border: 1px solid $border-color;
    background-color: $tertiary-color;
    margin-right: $spacing-md;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  &__no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $text-color-secondary;
    font-size: $font-size-xl;
  }
  
  &__product-info {
    flex: 1;
  }
  
  &__product-name {
    font-weight: $font-weight-medium;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }
  
  &__product-id {
    font-size: $font-size-small;
    color: $text-color-secondary;
  }
}
</style>