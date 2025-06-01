<!-- @/views/admin/AdminOrders.vue - Versión corregida -->
<template>
  <div class="admin-view admin-orders">
    <!-- Header optimizado -->
    <div class="admin-orders__header">
      <h1 class="admin-orders__title">Gestión de Pedidos</h1>

      <!-- Búsqueda -->
      <div class="admin-orders__search">
        <input v-model="searchQuery" placeholder="Buscar pedidos..." class="admin-orders__search-input" />
        <i class="fas fa-search admin-orders__search-icon"></i>
      </div>
    </div>

    <!-- Filtros móviles -->
    <div class="admin-orders__filters">
      <div class="admin-orders__filter-group">
        <label class="admin-orders__filter-label">
          <i class="fas fa-calendar-alt"></i>
          Filtrar por fecha
        </label>
        <select v-model="dateFilter" class="admin-orders__filter-select">
          <option value="all">Todas las fechas</option>
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
        </select>
      </div>

      <div class="admin-orders__filter-group">
        <label class="admin-orders__filter-label">
          <i class="fas fa-sort"></i>
          Ordenar por
        </label>
        <select v-model="sortBy" class="admin-orders__filter-select">
          <option value="date_desc">Fecha (más reciente primero)</option>
          <option value="date_asc">Fecha (más antigua primero)</option>
          <option value="total_desc">Total (mayor primero)</option>
          <option value="total_asc">Total (menor primero)</option>
        </select>
      </div>
    </div>

    <!-- Debug info -->
    <div v-if="debugMode" class="admin-orders__debug">
      <p><strong>Debug:</strong> Pedidos: {{ adminStore.orders.length }}, Cache: {{ ordersWithDetails.size }}</p>
      <button @click="loadOrdersDetails" class="admin-orders__debug-btn">Recargar detalles</button>
    </div>

    <!-- Estado de carga inicial -->
    <div v-if="initialLoading" class="admin-orders__loading">
      <div class="admin-orders__spinner"></div>
      <p>Cargando pedidos y detalles...</p>
    </div>

    <!-- Contenido principal -->
    <div v-else class="admin-orders__content">
      <!-- Vista móvil: Cards -->
      <div class="admin-orders__mobile-list">
        <div v-if="filteredOrders.length === 0" class="admin-orders__empty">
          <div class="admin-orders__empty-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <h3 class="admin-orders__empty-title">
            {{ searchQuery || dateFilter !== 'all' ? 'Sin resultados' : 'No hay pedidos' }}
          </h3>
          <p class="admin-orders__empty-description">
            {{
              searchQuery || dateFilter !== 'all'
                ? 'No se encontraron pedidos con esos criterios'
                : 'No hay pedidos registrados'
            }}
          </p>
        </div>

        <div v-for="order in filteredOrders" :key="order.id" class="admin-orders__card"
          @click="viewOrderDetails(order)">
          <div class="admin-orders__card-header">
            <div class="admin-orders__card-info-section">
              <div class="admin-orders__card-id">#{{ order.id }}</div>
              <div class="admin-orders__card-date">{{ order.fechaFormateada }}</div>
            </div>
            <div class="admin-orders__card-total">{{ formatCurrency(order.total) }}</div>
          </div>

          <div class="admin-orders__card-body">
            <div class="admin-orders__card-info">
              <div class="admin-orders__info-item">
                <i class="fas fa-user"></i>
                <span class="admin-orders__info-label">Cliente:</span>
                <span class="admin-orders__info-value">{{ getUserName(order.usuarioId) }}</span>
              </div>
              <div class="admin-orders__info-item">
                <i class="fas fa-box"></i>
                <span class="admin-orders__info-label">Productos:</span>
                <span class="admin-orders__info-value">{{ getOrderProductsCount(order) }}</span>
              </div>
            </div>

            <div class="admin-orders__card-actions">
              <button class="admin-orders__action-btn admin-orders__action-btn--view"
                @click.stop="viewOrderDetails(order)" title="Ver detalles">
                <i class="fas fa-eye"></i>
              </button>
              <button class="admin-orders__action-btn admin-orders__action-btn--delete"
                @click.stop="confirmDeleteOrder(order)" title="Eliminar">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista desktop: Tabla -->
      <div class="admin-orders__desktop-table">
        <table class="admin-orders__table">
          <thead class="admin-orders__table-head">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Nº Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody class="admin-orders__table-body">
            <tr v-for="order in filteredOrders" :key="order.id" class="admin-orders__table-row">
              <td class="admin-orders__table-cell">#{{ order.id }}</td>
              <td class="admin-orders__table-cell">{{ getUserName(order.usuarioId) }}</td>
              <td class="admin-orders__table-cell">{{ order.fechaFormateada }}</td>
              <td class="admin-orders__table-cell">{{ formatCurrency(order.total) }}</td>
              <td class="admin-orders__table-cell">
                <div class="admin-orders__products-count">
                  <i class="fas fa-box"></i>
                  <span>{{ getOrderProductsCount(order) }}</span>
                </div>
              </td>
              <td class="admin-orders__table-cell">
                <div class="admin-orders__table-actions">
                  <button class="admin-orders__action-btn admin-orders__action-btn--view"
                    @click="viewOrderDetails(order)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="admin-orders__action-btn admin-orders__action-btn--delete"
                    @click="confirmDeleteOrder(order)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
                    <span class="admin-orders__info-value admin-orders__info-value--price">{{
                      formatCurrency(selectedOrder?.total || 0) }}</span>
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
                  Productos ({{ getOrderProductsCount(selectedOrder) }})
                </h3>
              </div>
              <div class="admin-orders__info-card-content">
                <div v-if="loadingOrderDetails" class="admin-orders__loading">
                  <div class="admin-orders__spinner"></div>
                  <span>Cargando detalles...</span>
                </div>

                <!-- Vista móvil de productos -->
                <div v-else class="admin-orders__products-mobile">
                  <div v-if="orderDetails.length === 0" class="admin-orders__no-products">
                    <i class="fas fa-box-open"></i>
                    <p>No se encontraron productos en este pedido</p>
                  </div>

                  <div v-for="item in orderDetails" :key="item.id" class="admin-orders__product-card">
                    <div class="admin-orders__product-image">
                      <div class="admin-orders__thumb-image">
                        <img v-if="getProductImage(item.productoId)" :src="getProductImage(item.productoId)"
                          :alt="getProductName(item.productoId)">
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
                          Cantidad: {{ item.cantidad }}
                        </span>
                        <span class="admin-orders__product-subtotal">
                          Subtotal: {{ formatCurrency(item.precioUnitario * item.cantidad) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-if="orderDetails.length > 0" class="admin-orders__products-total">
                    <strong>Total: {{ formatCurrency(selectedOrder?.total || 0) }}</strong>
                  </div>
                </div>

                <!-- Vista desktop de productos -->
                <div class="admin-orders__products-desktop">
                  <div v-if="orderDetails.length === 0" class="admin-orders__no-products">
                    <i class="fas fa-box-open"></i>
                    <p>No se encontraron productos en este pedido</p>
                  </div>

                  <table v-else class="admin-orders__products-table">
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
                              <img v-if="getProductImage(item.productoId)" :src="getProductImage(item.productoId)"
                                :alt="getProductName(item.productoId)">
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
          <button class="admin-orders__modal-btn admin-orders__modal-btn--danger"
            @click="confirmDeleteOrder(selectedOrder)">
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
          <button class="admin-orders__modal-btn admin-orders__modal-btn--secondary" @click="cancelDelete"
            :disabled="loading">
            <i class="fas fa-times"></i>
            <span class="admin-orders__btn-text">Cancelar</span>
          </button>
          <button class="admin-orders__modal-btn admin-orders__modal-btn--danger" @click="deleteOrder"
            :disabled="loading">
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
const initialLoading = ref(true);
const loadingOrderDetails = ref(false);
const selectedOrder = ref<Pedido | null>(null);
const orderToDelete = ref<Pedido | null>(null);
const orderDetails = ref<DetallePedido[]>([]);
const showOrderDetails = ref(false);
const showDeleteConfirmation = ref(false);
const debugMode = ref(false); // Para debug en desarrollo

// Store para cachear los detalles de pedidos ya cargados
const ordersWithDetails = ref<Map<number, DetallePedido[]>>(new Map());

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
  console.log('=== INICIANDO CARGA DE PEDIDOS ===');

  try {
    initialLoading.value = true;

    // 1. Cargar datos básicos si no están cargados
    const loadPromises = [];

    if (adminStore.orders.length === 0) {
      console.log('Cargando pedidos...');
      loadPromises.push(adminStore.fetchAllOrders());
    }

    if (adminStore.users.length === 0) {
      console.log('Cargando usuarios...');
      loadPromises.push(adminStore.fetchAllUsers());
    }

    if (adminStore.products.length === 0) {
      console.log('Cargando productos...');
      loadPromises.push(adminStore.fetchAllProducts());
    }

    if (loadPromises.length > 0) {
      await Promise.all(loadPromises);
    }

    console.log(`Datos básicos cargados: ${adminStore.orders.length} pedidos, ${adminStore.users.length} usuarios, ${adminStore.products.length} productos`);

    // 2. Cargar detalles de pedidos
    await loadOrdersDetails();

  } catch (error) {
    console.error('Error en la carga inicial:', error);
    toast.error('Error al cargar los datos de pedidos');
  } finally {
    initialLoading.value = false;
    console.log('=== CARGA COMPLETADA ===');
  }
});

// Función para cargar los detalles de todos los pedidos
const loadOrdersDetails = async () => {
  if (adminStore.orders.length === 0) {
    console.log('No hay pedidos para cargar detalles');
    return;
  }

  console.log(`Iniciando carga de detalles para ${adminStore.orders.length} pedidos...`);

  try {
    // Usar el nuevo método del store que carga en lotes
    const detailsMap = await adminStore.loadOrdersDetails();

    // Actualizar nuestro cache local
    ordersWithDetails.value = detailsMap;

    console.log(`✅ Detalles cargados para ${detailsMap.size} pedidos`);

    // Log de resumen
    const totalProducts = Array.from(detailsMap.values()).reduce((total, details) => {
      return total + details.reduce((sum, detail) => sum + detail.cantidad, 0);
    }, 0);

    console.log(`📊 Total de productos en todos los pedidos: ${totalProducts}`);

  } catch (error) {
    console.error('Error al cargar detalles de pedidos:', error);
    toast.error('Error al cargar los detalles de los pedidos');
  }
};

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

const getOrderProductsCount = (order: Pedido | null) => {
  if (!order) return '-';

  console.log(`Calculando productos para pedido ${order.id}...`);

  // Primero intentar con los detalles del pedido si ya los tiene
  if (order.detalles && order.detalles.length > 0) {
    const totalItems = order.detalles.reduce((total, detail) => total + detail.cantidad, 0);
    console.log(`Pedido ${order.id}: ${totalItems} productos (desde order.detalles)`);
    return totalItems.toString();
  }

  // Si no, buscar en el cache local
  const cachedDetails = ordersWithDetails.value.get(order.id);
  if (cachedDetails && cachedDetails.length > 0) {
    const totalItems = cachedDetails.reduce((total, detail) => total + detail.cantidad, 0);
    console.log(`Pedido ${order.id}: ${totalItems} productos (desde cache)`);
    return totalItems.toString();
  }

  console.log(`Pedido ${order.id}: Sin detalles disponibles`);
  return '-';
};

const handleOverlayClick = () => {
  closeOrderDetails();
};

const viewOrderDetails = async (order: Pedido) => {
  console.log('=== ABRIENDO DETALLES DEL PEDIDO ===');
  console.log('Pedido seleccionado:', order);

  selectedOrder.value = order;
  showOrderDetails.value = true;

  // Comprobar si ya tenemos los detalles en el cache
  const cachedDetails = ordersWithDetails.value.get(order.id);
  if (cachedDetails && cachedDetails.length > 0) {
    orderDetails.value = cachedDetails;
    console.log(`✅ Usando detalles del cache: ${cachedDetails.length} productos`);
    return;
  }

  // Si están en el objeto order
  if (order.detalles && order.detalles.length > 0) {
    orderDetails.value = order.detalles;
    console.log(`✅ Usando detalles del objeto order: ${order.detalles.length} productos`);
    return;
  }

  // Si no están disponibles, cargarlos desde el servidor
  loadingOrderDetails.value = true;
  try {
    console.log('🔄 Cargando detalles desde el servidor...');

    const details = await adminStore.getOrderDetails(order.id);
    orderDetails.value = details;

    // Guardar en cache
    ordersWithDetails.value.set(order.id, details);

    console.log(`✅ Detalles cargados desde servidor: ${details.length} productos`);

  } catch (error) {
    console.error('❌ Error al cargar detalles del pedido:', error);
    toast.error('Error al cargar los detalles del pedido');
    orderDetails.value = [];
  } finally {
    loadingOrderDetails.value = false;
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

    // Eliminar del cache si existe
    ordersWithDetails.value.delete(orderToDelete.value.id);

    console.log('Recargando lista de pedidos después de eliminar...');
    await adminStore.fetchAllOrders();

    // Recargar detalles
    await loadOrdersDetails();

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

  // Debug panel
  &__debug {
    background: rgba($warning-color, 0.1);
    border: 1px solid $warning-color;
    border-radius: $border-radius;
    padding: $spacing-sm;
    margin-bottom: $spacing-md;
    font-size: $font-size-small;

    &-btn {
      margin-left: $spacing-sm;
      padding: $spacing-xs $spacing-sm;
      background: $warning-color;
      color: white;
      border: none;
      border-radius: $border-radius-sm;
      cursor: pointer;
      font-size: $font-size-small;
    }
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

  // Filtros
  &__filters {
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
    border: 1px solid $border-color;
    padding: $spacing-md;
    margin-bottom: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    @media (min-width: $breakpoint-sm) {
      flex-direction: row;
      gap: $spacing-lg;
      padding: $spacing-lg;
    }
  }

  &__filter-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    width: 100%;

    @media (min-width: $breakpoint-sm) {
      max-width: 250px;
    }
  }

  &__filter-label {
    font-size: $font-size-small;
    font-weight: $font-weight-semibold;
    color: $text-color;
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    i {
      color: $primary-color;
      font-size: 12px;
    }
  }

  &__filter-select {
    padding: $spacing-sm $spacing-md;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    font-size: $font-size-base;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
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

    &-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-color, 0.05) 100%);
      border-radius: $border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-lg;

      i {
        font-size: 36px;
        color: rgba($primary-color, 0.6);
      }
    }

    &-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;
    }

    &-description {
      color: $text-color-secondary;
      margin: 0;
      line-height: 1.5;
    }
  }

  &__card {
    background: white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
    margin-bottom: $spacing-md;
    overflow: hidden;
    transition: transform $transition-fast, box-shadow $transition-fast;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $box-shadow-lg;
    }
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md;
    background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);
    border-bottom: 1px solid $tertiary-color;
  }

  &__card-info-section {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__card-id {
    background: linear-gradient(135deg, $primary-color 0%, #4bc286 100%);
    color: white;
    padding: 4px 8px;
    border-radius: $border-radius-sm;
    font-size: $font-size-small;
    font-weight: $font-weight-semibold;
    box-shadow: 0 2px 4px rgba($primary-color, 0.3);
    align-self: flex-start;
  }

  &__card-date {
    font-size: $font-size-small;
    color: $text-color-secondary;
    font-weight: $font-weight-medium;
  }

  &__card-total {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $primary-color;
  }

  &__card-body {
    padding: $spacing-md;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  &__card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-small;

    i {
      color: $primary-color;
      width: 14px;
      font-size: 12px;
    }
  }

  &__info-label {
    font-weight: $font-weight-semibold;
    color: $text-color-secondary;
    min-width: 80px;
  }

  &__info-value {
    color: $text-color;
    font-weight: $font-weight-medium;
  }

  &__card-actions {
    display: flex;
    gap: $spacing-xs;
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

  // Estilo específico para el contador de productos en la tabla
  &__products-count {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    justify-content: center;
    padding: $spacing-xs $spacing-sm;
    background: rgba($primary-color, 0.1);
    border-radius: $border-radius-sm;
    font-weight: $font-weight-semibold;
    color: $primary-color;
    min-width: 50px;

    i {
      font-size: 12px;
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

    th,
    td {
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

  // Estado sin productos
  &__no-products {
    text-align: center;
    padding: $spacing-xl;
    color: $text-color-secondary;

    i {
      font-size: 3rem;
      margin-bottom: $spacing-md;
      opacity: 0.5;
    }

    p {
      margin: 0;
      font-style: italic;
    }
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
    background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-color, 0.02) 100%);
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
    to {
      transform: rotate(360deg);
    }
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