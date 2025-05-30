<!-- @/views/admin/AdminOrders.vue -->
<template>
  <div class="admin-view admin-orders">
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
      
      <!-- Vista móvil (cards) -->
      <div class="mobile-orders-list" v-if="filteredOrders.length > 0">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="mobile-order-card"
          @click="viewOrderDetails(order)"
        >
          <div class="mobile-order-card__header">
            <div class="mobile-order-card__id">
              <i class="fas fa-hashtag"></i>
              {{ order.id }}
            </div>
            <div class="mobile-order-card__total">
              {{ formatCurrency(order.total) }}
            </div>
          </div>
          
          <div class="mobile-order-card__info">
            <div class="mobile-order-card__client">
              <i class="fas fa-user"></i>
              {{ getUserName(order.usuarioId) }}
            </div>
            <div class="mobile-order-card__date">
              <i class="fas fa-calendar-alt"></i>
              {{ order.fechaFormateada }}
            </div>
            <div class="mobile-order-card__products" v-if="getOrderProductsCount(order) !== 'N/A'">
              <i class="fas fa-box"></i>
              {{ getOrderProductsCount(order) }} productos
            </div>
          </div>
          
          <div class="mobile-order-card__actions">
            <button 
              class="mobile-action-btn mobile-action-btn--view" 
              @click.stop="viewOrderDetails(order)"
              aria-label="Ver detalles"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button 
              class="mobile-action-btn mobile-action-btn--delete" 
              @click.stop="confirmDeleteOrder(order)"
              aria-label="Eliminar"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Vista desktop (tabla) -->
      <AdminTable 
        :columns="columns"
        :isEmpty="filteredOrders.length === 0"
        :emptyMessage="searchQuery || dateFilter !== 'all' ? 'No se encontraron pedidos con esos criterios' : 'No hay pedidos registrados'"
        class="desktop-table"
      >
        <tr v-for="order in filteredOrders" :key="order.id">
          <td>#{{ order.id }}</td>
          <td>{{ getUserName(order.usuarioId) }}</td>
          <td>{{ order.fechaFormateada }}</td>
          <td>{{ formatCurrency(order.total) }}</td>
          <td>{{ getOrderProductsCount(order) }}</td>
          <td class="action-buttons">
            <button class="btn btn-view" @click="viewOrderDetails(order)" title="Ver detalles">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-delete" @click="confirmDeleteOrder(order)" title="Eliminar pedido">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </AdminTable>
    </AdminContent>
    
    <!-- Modal de detalles de pedido -->
    <div v-if="showOrderDetails" class="admin-orders__modal-overlay" @click="handleOverlayClick">
      <div class="admin-orders__modal admin-orders__modal--large" @click.stop>
        <div class="admin-orders__modal-header">
          <h2 class="admin-orders__modal-title">
            Detalles del Pedido #{{ selectedOrder?.id || '' }}
          </h2>
          <button class="admin-orders__modal-close" @click="closeOrderDetails">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-orders__modal-body">
          <div class="admin-orders__details">
            <!-- Información del Pedido -->
            <div class="admin-orders__info-card">
              <div class="admin-orders__info-card-header">
                <h3 class="admin-orders__info-card-title">
                  <i class="fas fa-info-circle"></i>
                  Información del Pedido
                </h3>
              </div>
              <div class="admin-orders__info-card-content">
                <div class="admin-orders__info-grid">
                  <div class="admin-orders__info-item">
                    <i class="fas fa-hashtag"></i>
                    <span class="admin-orders__info-label">ID:</span>
                    <span class="admin-orders__info-value">#{{ selectedOrder?.id }}</span>
                  </div>
                  <div class="admin-orders__info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span class="admin-orders__info-label">Fecha:</span>
                    <span class="admin-orders__info-value">{{ selectedOrder?.fechaFormateada }}</span>
                  </div>
                  <div class="admin-orders__info-item">
                    <i class="fas fa-euro-sign"></i>
                    <span class="admin-orders__info-label">Total:</span>
                    <span class="admin-orders__info-value admin-orders__info-value--price">{{ formatCurrency(selectedOrder?.total || 0) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Información del Cliente -->
            <div class="admin-orders__info-card">
              <div class="admin-orders__info-card-header">
                <h3 class="admin-orders__info-card-title">
                  <i class="fas fa-user"></i>
                  Cliente
                </h3>
              </div>
              <div class="admin-orders__info-card-content">
                <div class="admin-orders__info-grid">
                  <div class="admin-orders__info-item">
                    <i class="fas fa-user"></i>
                    <span class="admin-orders__info-label">Nombre:</span>
                    <span class="admin-orders__info-value">{{ getUserName(selectedOrder?.usuarioId || 0) }}</span>
                  </div>
                  <div class="admin-orders__info-item">
                    <i class="fas fa-envelope"></i>
                    <span class="admin-orders__info-label">Email:</span>
                    <span class="admin-orders__info-value">{{ getUserEmail(selectedOrder?.usuarioId || 0) }}</span>
                  </div>
                  <div class="admin-orders__info-item" v-if="getUserPhone(selectedOrder?.usuarioId || 0)">
                    <i class="fas fa-phone"></i>
                    <span class="admin-orders__info-label">Teléfono:</span>
                    <span class="admin-orders__info-value">{{ getUserPhone(selectedOrder?.usuarioId || 0) }}</span>
                  </div>
                  <div class="admin-orders__info-item" v-if="getUserAddress(selectedOrder?.usuarioId || 0)">
                    <i class="fas fa-map-marker-alt"></i>
                    <span class="admin-orders__info-label">Dirección:</span>
                    <span class="admin-orders__info-value">{{ getUserAddress(selectedOrder?.usuarioId || 0) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Productos -->
            <div class="admin-orders__info-card">
              <div class="admin-orders__info-card-header">
                <h3 class="admin-orders__info-card-title">
                  <i class="fas fa-box"></i>
                  Productos
                </h3>
              </div>
              <div class="admin-orders__info-card-content">
                <div v-if="loadingOrderDetails" class="admin-orders__loading">
                  <div class="admin-orders__spinner"></div>
                  <span>Cargando detalles...</span>
                </div>
                
                <!-- Vista móvil de productos -->
                <div v-else class="admin-orders__products-mobile">
                  <div v-for="item in orderDetails" :key="item.id" class="admin-orders__product-card">
                    <div class="admin-orders__product-image">
                      <div class="admin-orders__thumb-image">
                        <img 
                          v-if="getProductImage(item.productoId)" 
                          :src="getProductImage(item.productoId)"
                          :alt="getProductName(item.productoId)"
                        >
                        <div v-else class="admin-orders__thumb-placeholder">
                          <i class="fas fa-box"></i>
                        </div>
                      </div>
                    </div>
                    <div class="admin-orders__product-info">
                      <div class="admin-orders__product-name">
                        {{ getProductName(item.productoId) }}
                      </div>
                      <div class="admin-orders__product-id">
                        ID: {{ item.productoId }}
                      </div>
                      <div class="admin-orders__product-details">
                        <span class="admin-orders__product-price">
                          {{ formatCurrency(item.precioUnitario) }}
                        </span>
                        <span class="admin-orders__product-quantity">
                          Cant: {{ item.cantidad }}
                        </span>
                        <span class="admin-orders__product-subtotal">
                          {{ formatCurrency(item.precioUnitario * item.cantidad) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="admin-orders__products-total">
                    <strong>Total: {{ formatCurrency(selectedOrder?.total || 0) }}</strong>
                  </div>
                </div>
                
                <!-- Vista desktop de productos -->
                <div class="admin-orders__products-desktop">
                  <table class="admin-orders__products-table">
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
                          <div class="admin-orders__table-product">
                            <div class="admin-orders__thumb-image">
                              <img 
                                v-if="getProductImage(item.productoId)" 
                                :src="getProductImage(item.productoId)"
                                :alt="getProductName(item.productoId)"
                              >
                              <div v-else class="admin-orders__thumb-placeholder">
                                <i class="fas fa-box"></i>
                              </div>
                            </div>
                            <div class="admin-orders__table-product-info">
                              <div class="admin-orders__table-product-name">
                                {{ getProductName(item.productoId) }}
                              </div>
                              <div class="admin-orders__table-product-id">
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
                        <td colspan="3" class="admin-orders__table-total-label">
                          Total
                        </td>
                        <td class="admin-orders__table-total-value">
                          {{ formatCurrency(selectedOrder?.total || 0) }}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-orders__modal-footer">
          <button class="admin-orders__modal-btn admin-orders__modal-btn--secondary" @click="closeOrderDetails">
            <i class="fas fa-times"></i>
            <span class="admin-orders__btn-text">Cerrar</span>
          </button>
          <button class="admin-orders__modal-btn admin-orders__modal-btn--danger" @click="confirmDeleteOrder(selectedOrder)">
            <i class="fas fa-trash-alt"></i>
            <span class="admin-orders__btn-text">Eliminar</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteConfirmation" class="admin-orders__modal-overlay" @click="cancelDelete">
      <div class="admin-orders__modal admin-orders__modal--small" @click.stop>
        <div class="admin-orders__modal-header">
          <h2 class="admin-orders__modal-title">Confirmar Eliminación</h2>
          <button class="admin-orders__modal-close" @click="cancelDelete">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="admin-orders__modal-body">
          <div class="admin-orders__confirm">
            <i class="fas fa-exclamation-triangle admin-orders__confirm-icon"></i>
            <p class="admin-orders__confirm-text">
              ¿Eliminar el pedido <strong>#{{ orderToDelete?.id }}</strong>?
              <br>Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div class="admin-orders__modal-footer">
          <button class="admin-orders__modal-btn admin-orders__modal-btn--secondary" @click="cancelDelete" :disabled="loading">
            <i class="fas fa-times"></i>
            <span class="admin-orders__btn-text">Cancelar</span>
          </button>
          <button class="admin-orders__modal-btn admin-orders__modal-btn--danger" @click="deleteOrder" :disabled="loading">
            <i v-if="loading" class="admin-orders__spinner"></i>
            <i v-else class="fas fa-trash-alt"></i>
            <span class="admin-orders__btn-text">{{ loading ? 'Eliminando...' : 'Eliminar' }}</span>
          </button>
        </div>
      </div>
    </div>
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

const handleOverlayClick = () => {
  closeOrderDetails();
};

const viewOrderDetails = async (order: Pedido) => {
  console.log('Viendo detalles del pedido:', order);
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
  console.log('Cerrando detalles del pedido...');
  showOrderDetails.value = false;
  selectedOrder.value = null;
  orderDetails.value = [];
};

const confirmDeleteOrder = (order: Pedido | null) => {
  if (!order) return;
  console.log('Confirmando eliminación de pedido:', order);
  orderToDelete.value = order;
  showDeleteConfirmation.value = true;
  
  if (showOrderDetails.value) {
    showOrderDetails.value = false;
  }
};

const cancelDelete = () => {
  console.log('Cancelando eliminación');
  showDeleteConfirmation.value = false;
  orderToDelete.value = null;
};

const deleteOrder = async () => {
  console.log('Eliminando pedido...', orderToDelete.value);
  
  if (!orderToDelete.value?.id) {
    toast.error('No hay pedido seleccionado para eliminar');
    return;
  }

  loading.value = true;

  try {
    await adminStore.deleteOrder(orderToDelete.value.id);
    
    console.log('Recargando lista de pedidos después de eliminar...');
    await adminStore.fetchAllOrders();
    
    toast.success('Pedido eliminado correctamente');
    showDeleteConfirmation.value = false;
    orderToDelete.value = null;
    
    console.log('Eliminación completada. Total pedidos:', adminStore.orders.length);
    
  } catch (error: any) {
    console.error('Error al eliminar pedido:', error);
    toast.error(error.message || 'Error al eliminar pedido');
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-orders {
  padding: $spacing-sm;
  min-height: 100vh;
  background-color: $tertiary-color;
  
  @media (min-width: $breakpoint-sm) {
    padding: $spacing-md;
  }
  
  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }

  .mobile-orders-list {
    display: block;
    gap: $spacing-sm;
    padding: $spacing-sm;
    
    @media (min-width: $breakpoint-md) {
      display: none;
    }
  }
  
  .mobile-order-card {
    background: white;
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    box-shadow: $box-shadow;
    border: 1px solid $border-color;
    margin-bottom: $spacing-md;
    cursor: pointer;
    transition: all $transition-fast;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: $box-shadow-lg;
    }
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;
      padding-bottom: $spacing-sm;
      border-bottom: 1px solid $tertiary-color;
    }
    
    &__id {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-weight: $font-weight-semibold;
      color: $text-color;
      font-size: $font-size-base;
      
      i {
        color: $primary-color;
        font-size: 12px;
      }
    }
    
    &__total {
      font-weight: $font-weight-bold;
      color: $primary-color;
      font-size: $font-size-base;
    }
    
    &__info {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      margin-bottom: $spacing-sm;
    }
    
    &__client,
    &__date,
    &__products {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-small;
      color: $text-color-secondary;
      
      i {
        color: $primary-color;
        width: 14px;
        font-size: 12px;
      }
    }
    
    &__client {
      font-weight: $font-weight-medium;
      color: $text-color;
    }
    
    &__actions {
      display: flex;
      justify-content: flex-end;
      gap: $spacing-xs;
    }
  }
  
  .mobile-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: all $transition-fast;
    
    i {
      font-size: 12px;
    }
    
    &--view {
      background: rgba($info-color, 0.1);
      color: $info-color;
      
      &:hover {
        background: $info-color;
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
  
  // Ocultar tabla en móvil
  .desktop-table {
    display: none;
    
    @media (min-width: $breakpoint-md) {
      display: block;
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
    
    &--large {
      max-width: 800px;
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

  // Detalles del pedido
  &__details {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__info-card {
    background: white;
    border: 1px solid $border-color;
    border-radius: $border-radius-lg;
    overflow: hidden;
  }

  &__info-card-header {
    background: $tertiary-color;
    padding: $spacing-md;
    border-bottom: 1px solid $border-color;
  }

  &__info-card-title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $text-color;
    margin: 0;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    
    i {
      color: $primary-color;
      font-size: 14px;
    }
  }

  &__info-card-content {
    padding: $spacing-md;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-sm;
    
    @media (min-width: $breakpoint-sm) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-xs;
    
    i {
      color: $primary-color;
      font-size: 12px;
      width: 14px;
      flex-shrink: 0;
    }
  }

  &__info-label {
    font-weight: $font-weight-medium;
    color: $text-color-secondary;
    font-size: $font-size-small;
    min-width: 60px;
    flex-shrink: 0;
  }

  &__info-value {
    color: $text-color;
    font-size: $font-size-small;
    word-break: break-word;
    
    &--price {
      color: $primary-color;
      font-weight: $font-weight-semibold;
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    gap: $spacing-sm;
    color: $text-color-secondary;
    font-size: $font-size-small;
  }

  // Vista móvil de productos
  &__products-mobile {
    display: block;
    
    @media (min-width: $breakpoint-md) {
      display: none;
    }
  }

  &__product-card {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    margin-bottom: $spacing-sm;
    background: $tertiary-color;
  }

  &__product-image {
    flex-shrink: 0;
  }

  &__product-info {
    flex: 1;
    min-width: 0;
  }

  &__product-name {
    font-weight: $font-weight-medium;
    color: $text-color;
    font-size: $font-size-small;
    line-height: 1.3;
    margin-bottom: $spacing-xs;
  }

  &__product-id {
    font-size: 11px;
    color: $text-color-secondary;
    margin-bottom: $spacing-xs;
  }

  &__product-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
  }

  &__product-price {
    color: $text-color;
  }

  &__product-quantity {
    color: $text-color-secondary;
  }

  &__product-subtotal {
    color: $primary-color;
    font-weight: $font-weight-semibold;
  }

  &__products-total {
    text-align: center;
    padding: $spacing-sm;
    background: rgba($primary-color, 0.1);
    border-radius: $border-radius;
    color: $primary-color;
    font-size: $font-size-base;
    margin-top: $spacing-sm;
  }

  // Vista desktop de productos
  &__products-desktop {
    display: none;
    
    @media (min-width: $breakpoint-md) {
      display: block;
    }
  }

  &__products-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    overflow: hidden;
    
    th, td {
      padding: $spacing-sm;
      text-align: left;
      border-bottom: 1px solid $border-color;
      
      @media (min-width: $breakpoint-lg) {
        padding: $spacing-md;
      }
    }
    
    th {
      background-color: rgba($primary-color, 0.1);
      font-weight: $font-weight-semibold;
      color: $text-color;
      font-size: $font-size-small;
    }
    
    tbody tr:last-child td {
      border-bottom: none;
    }
    
    tfoot {
      td {
        font-weight: $font-weight-semibold;
        background-color: $tertiary-color;
        border-top: 2px solid $border-color;
      }
    }
  }

  &__table-product {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__table-product-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__table-product-name {
    font-weight: $font-weight-semibold;
    color: $text-color;
    font-size: $font-size-small;
  }

  &__table-product-id {
    font-size: 11px;
    color: $text-color-secondary;
  }

  &__table-total-label {
    text-align: right;
    color: $text-color;
  }

  &__table-total-value {
    color: $primary-color;
    font-weight: $font-weight-bold;
  }

  // Imagen thumbnail
  &__thumb-image {
    width: 40px;
    height: 40px;
    border-radius: $border-radius-sm;
    overflow: hidden;
    border: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    flex-shrink: 0;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }

  &__thumb-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $text-color-secondary;
    font-size: 16px;
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

  &__btn-text {
    @media (max-width: $breakpoint-sm - 1px) {
      display: none;
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
    
    .admin-orders__modal-btn--secondary & {
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

  // Responsive adjustments
  @media (min-width: $breakpoint-sm) {
    .mobile-order-card {
      padding: $spacing-lg;
      
      &__header {
        margin-bottom: $spacing-md;
        padding-bottom: $spacing-md;
      }
      
      &__info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;
      }
      
      &__products {
        grid-column: span 2;
      }
      
      &__id,
      &__total {
        font-size: $font-size-large;
      }
      
      &__client,
      &__date,
      &__products {
        font-size: $font-size-base;
        
        i {
          font-size: 14px;
        }
      }
      
      &__actions {
        gap: $spacing-sm;
      }
    }
    
    .mobile-action-btn {
      width: 36px;
      height: 36px;
      
      i {
        font-size: 14px;
      }
    }

    &__info-grid {
      gap: $spacing-md;
    }

    &__info-item {
      padding: $spacing-sm;
    }

    &__info-label {
      min-width: 80px;
      font-size: $font-size-base;
    }

    &__info-value {
      font-size: $font-size-base;
    }

    &__product-card {
      padding: $spacing-md;
      gap: $spacing-md;
    }

    &__product-name {
      font-size: $font-size-base;
    }

    &__product-id {
      font-size: $font-size-small;
    }

    &__product-details {
      font-size: $font-size-small;
      gap: $spacing-xs;
    }

    &__products-total {
      font-size: $font-size-large;
      padding: $spacing-md;
    }

    &__thumb-image {
      width: 50px;
      height: 50px;
    }

    &__thumb-placeholder {
      font-size: 20px;
    }

    &__btn-text {
      display: inline;
    }
  }

  @media (min-width: $breakpoint-md) {
    &__modal {
      &--large {
        max-width: 900px;
      }
    }

    &__details {
      gap: $spacing-xl;
    }

    &__info-card-header {
      padding: $spacing-lg;
    }

    &__info-card-content {
      padding: $spacing-lg;
    }

    &__info-card-title {
      font-size: $font-size-large;
      
      i {
        font-size: 16px;
      }
    }

    &__loading {
      padding: $spacing-xxl;
      font-size: $font-size-base;
    }

    &__thumb-image {
      width: 60px;
      height: 60px;
    }

    &__thumb-placeholder {
      font-size: 24px;
    }

    &__table-product {
      gap: $spacing-md;
    }

    &__table-product-name {
      font-size: $font-size-base;
    }

    &__table-product-id {
      font-size: $font-size-small;
    }
  }

  @media (min-width: $breakpoint-lg) {
    &__modal {
      &--large {
        max-width: 1000px;
      }
    }

    &__info-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    &__thumb-image {
      width: 70px;
      height: 70px;
    }

    &__table-product {
      gap: $spacing-lg;
    }
  }
} </style>