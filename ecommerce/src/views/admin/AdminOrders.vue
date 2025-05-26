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
    <AdminModal 
      v-model="showOrderDetails"
      :title="`Detalles del Pedido #${selectedOrder?.id || ''}`"
      size="lg"
      v-if="selectedOrder"
    >
      <div class="order-details">
        <div class="info-card">
          <div class="info-card__header">
            <h3 class="info-card__title">
              <i class="fas fa-info-circle"></i>
              Información del Pedido
            </h3>
          </div>
          <div class="info-card__content">
            <div class="info-card__grid">
              <div class="info-card__item">
                <i class="fas fa-hashtag"></i>
                <span class="info-card__label">ID:</span>
                <span class="info-card__value">#{{ selectedOrder.id }}</span>
              </div>
              <div class="info-card__item">
                <i class="fas fa-calendar-alt"></i>
                <span class="info-card__label">Fecha:</span>
                <span class="info-card__value">{{ selectedOrder.fechaFormateada }}</span>
              </div>
              <div class="info-card__item">
                <i class="fas fa-euro-sign"></i>
                <span class="info-card__label">Total:</span>
                <span class="info-card__value" style="color: var(--primary-color); font-weight: 600;">{{ formatCurrency(selectedOrder.total) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <div class="info-card__header">
            <h3 class="info-card__title">
              <i class="fas fa-user"></i>
              Cliente
            </h3>
          </div>
          <div class="info-card__content">
            <div class="info-card__grid">
              <div class="info-card__item">
                <i class="fas fa-user"></i>
                <span class="info-card__label">Nombre:</span>
                <span class="info-card__value">{{ getUserName(selectedOrder.usuarioId) }}</span>
              </div>
              <div class="info-card__item">
                <i class="fas fa-envelope"></i>
                <span class="info-card__label">Email:</span>
                <span class="info-card__value">{{ getUserEmail(selectedOrder.usuarioId) }}</span>
              </div>
              <div class="info-card__item" v-if="getUserPhone(selectedOrder.usuarioId)">
                <i class="fas fa-phone"></i>
                <span class="info-card__label">Teléfono:</span>
                <span class="info-card__value">{{ getUserPhone(selectedOrder.usuarioId) }}</span>
              </div>
              <div class="info-card__item" v-if="getUserAddress(selectedOrder.usuarioId)">
                <i class="fas fa-map-marker-alt"></i>
                <span class="info-card__label">Dirección:</span>
                <span class="info-card__value">{{ getUserAddress(selectedOrder.usuarioId) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <div class="info-card__header">
            <h3 class="info-card__title">
              <i class="fas fa-box"></i>
              Productos
            </h3>
          </div>
          <div class="info-card__content">
            <div v-if="loadingOrderDetails" class="order-details__loading">
              <div class="spinner"></div>
              <span>Cargando detalles...</span>
            </div>
            
            <!-- Vista móvil de productos -->
            <div v-else class="products-mobile-view">
              <div 
                v-for="item in orderDetails" 
                :key="item.id"
                class="product-mobile-card"
              >
                <div class="product-mobile-card__image">
                  <div class="thumb-image">
                    <img 
                      v-if="getProductImage(item.productoId)" 
                      :src="getProductImage(item.productoId)"
                      :alt="getProductName(item.productoId)"
                    >
                    <div v-else class="thumb-image__placeholder">
                      <i class="fas fa-box"></i>
                    </div>
                  </div>
                </div>
                <div class="product-mobile-card__info">
                  <div class="product-mobile-card__name">
                    {{ getProductName(item.productoId) }}
                  </div>
                  <div class="product-mobile-card__id">
                    ID: {{ item.productoId }}
                  </div>
                  <div class="product-mobile-card__details">
                    <span class="product-mobile-card__price">
                      {{ formatCurrency(item.precioUnitario) }}
                    </span>
                    <span class="product-mobile-card__quantity">
                      Cant: {{ item.cantidad }}
                    </span>
                    <span class="product-mobile-card__subtotal">
                      {{ formatCurrency(item.precioUnitario * item.cantidad) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="products-total">
                <strong>Total: {{ formatCurrency(selectedOrder.total) }}</strong>
              </div>
            </div>
            
            <!-- Vista desktop de productos (tabla) -->
            <table class="order-details__table">
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
                      <div class="thumb-image">
                        <img 
                          v-if="getProductImage(item.productoId)" 
                          :src="getProductImage(item.productoId)"
                          :alt="getProductName(item.productoId)"
                        >
                        <div v-else class="thumb-image__placeholder">
                          <i class="fas fa-box"></i>
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
          <i class="fas fa-times"></i>
          <span class="btn-text">Cerrar</span>
        </button>
        <button class="modal-btn error-btn" @click="confirmDeleteOrder(selectedOrder)">
          <i class="fas fa-trash-alt"></i>
          <span class="btn-text">Eliminar</span>
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
      <div class="confirm-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>
          ¿Estás seguro de que deseas eliminar el pedido
          <strong>#{{ orderToDelete.id }}</strong>?
          <br>
          Esta acción no se puede deshacer.
        </p>
      </div>
      
      <template #footer>
        <button class="modal-btn secondary-btn" @click="cancelDelete">
          <i class="fas fa-times"></i>
          <span class="btn-text">Cancelar</span>
        </button>
        <button 
          class="modal-btn error-btn" 
          @click="deleteOrder"
          :disabled="loading"
        >
          <i v-if="loading" class="spinner"></i>
          <i v-else class="fas fa-trash-alt"></i>
          <span class="btn-text">{{ loading ? 'Eliminando...' : 'Eliminar' }}</span>
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

<style lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/admin-unified-styles.scss';

.admin-orders {
  // MOBILE FIRST - Base styles (320px+)
  
  // Vista móvil - Cards en lugar de tabla
  .mobile-orders-list {
    display: block;
    gap: $spacing-sm;
  }
  
  .mobile-order-card {
    background: white;
    border-radius: $border-radius;
    padding: $spacing-sm;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid $border-color;
    margin-bottom: $spacing-sm;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
    border-radius: $border-radius-sm;
    cursor: pointer;
    transition: all 0.2s ease;
    
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
  }
  
  // Modal - Estilos móviles
  .order-details {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    &__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $spacing-lg;
      gap: $spacing-sm;
      color: $text-color-secondary;
      font-size: $font-size-small;
    }
  }
  
  // Vista móvil de productos dentro del modal
  .products-mobile-view {
    display: block;
  }
  
  .product-mobile-card {
    display: flex;
    align-items: flex-start;
    gap: $spacing-sm;
    padding: $spacing-sm;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    margin-bottom: $spacing-sm;
    background: $tertiary-color;
    
    &__image {
      flex-shrink: 0;
    }
    
    &__info {
      flex: 1;
      min-width: 0;
    }
    
    &__name {
      font-weight: $font-weight-medium;
      color: $text-color;
      font-size: $font-size-small;
      line-height: 1.3;
      margin-bottom: $spacing-xs;
    }
    
    &__id {
      font-size: 11px;
      color: $text-color-secondary;
      margin-bottom: $spacing-xs;
    }
    
    &__details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 12px;
    }
    
    &__price {
      color: $text-color;
    }
    
    &__quantity {
      color: $text-color-secondary;
    }
    
    &__subtotal {
      color: $primary-color;
      font-weight: $font-weight-semibold;
    }
  }
  
  .products-total {
    text-align: center;
    padding: $spacing-sm;
    background: rgba($primary-color, 0.1);
    border-radius: $border-radius;
    color: $primary-color;
    font-size: $font-size-base;
    margin-top: $spacing-sm;
  }
  
  // Ocultar tabla de productos en móvil
  .order-details__table {
    display: none;
  }
  
  // Botones del modal - solo iconos en móvil
  .modal-btn {
    .btn-text {
      display: none;
    }
  }
  
  // TABLET - 768px y superior
  @media (min-width: $breakpoint-md) {
    // Mostrar tabla, ocultar vista móvil
    .mobile-orders-list {
      display: none;
    }
    
    .desktop-table {
      display: block;
    }
    
    // Modal - Vista tablet/desktop
    .order-details {
      gap: $spacing-lg;
      
      &__loading {
        padding: $spacing-xl;
        gap: $spacing-md;
        font-size: $font-size-base;
      }
      
      &__product {
        display: flex;
        align-items: center;
        gap: $spacing-md;
      }
      
      &__product-info {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
      }
      
      &__product-name {
        font-weight: $font-weight-semibold;
        color: $text-color;
      }
      
      &__product-id {
        font-size: $font-size-small;
        color: $text-color-secondary;
      }
      
      &__table {
        display: table;
        width: 100%;
        border-collapse: collapse;
        border: 1px solid $border-color;
        border-radius: $border-radius;
        overflow: hidden;
        
        th, td {
          padding: $spacing-sm;
          text-align: left;
          border-bottom: 1px solid $border-color;
        }
        
        th {
          background-color: rgba($primary-color, 0.1);
          font-weight: $font-weight-semibold;
          color: $text-color;
        }
        
        tfoot {
          td {
            font-weight: $font-weight-semibold;
            background-color: $tertiary-color;
          }
          
          .order-details__total-label {
            text-align: right;
            color: $text-color;
          }
          
          .order-details__total-value {
            color: $primary-color;
            font-weight: $font-weight-bold;
          }
        }
      }
    }
    
    // Ocultar vista móvil de productos
    .products-mobile-view {
      display: none;
    }
    
    // Mostrar texto en botones del modal
    .modal-btn {
      .btn-text {
        display: inline;
        margin-left: $spacing-xs;
      }
    }
  }
  
  // DESKTOP - 1024px y superior
  @media (min-width: $breakpoint-lg) {
    .mobile-order-card {
      &__header {
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
    }
    
    .order-details {
      &__table {
        th, td {
          padding: $spacing-md;
        }
      }
      
      &__product {
        gap: $spacing-lg;
      }
      
      &__loading {
        padding: $spacing-xxl;
      }
    }
    
    .product-mobile-card {
      padding: $spacing-md;
      gap: $spacing-md;
      
      &__name {
        font-size: $font-size-base;
      }
      
      &__id {
        font-size: $font-size-small;
      }
      
      &__details {
        font-size: $font-size-small;
        gap: $spacing-xs;
      }
    }
  }
  
  // LARGE DESKTOP - 1280px y superior  
  @media (min-width: $breakpoint-xl) {
    .mobile-order-card {
      padding: $spacing-md;
      
      &__header {
        margin-bottom: $spacing-md;
      }
      
      &__id {
        font-size: $font-size-large;
      }
      
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
    
    .order-details {
      &__table {
        th, td {
          padding: $spacing-lg;
        }
      }
    }
    
    .products-total {
      font-size: $font-size-large;
      padding: $spacing-md;
    }
  }
}
</style>