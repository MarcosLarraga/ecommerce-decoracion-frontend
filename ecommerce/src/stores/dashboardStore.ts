// src/stores/dashboardStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue-toastification';

interface DashboardMetrica {
  nombre: string;
  valor: string;
  icono: string;
  colorClase: string;
}

interface ProductoMasVendido {
  productoId: number;
  nombre: string;
  cantidadVendida: number;
  totalVendido: number;
  urlImagen: string | null;
}

interface VentaMensual {
  mes: string;
  total: number;
}

interface VentasPorCategoria {
  categoriaId: number;
  nombre: string;
  total: number;
  porcentaje: number;
}

interface DashboardData {
  titulo: string;
  descripcion: string;
  totalUsuarios: number;
  totalProductos: number;
  totalPedidos: number;
  ventasTotales: number;
  ventasHoy: number;
  ultimaActualizacion: string;
  metricas: DashboardMetrica[];
  productosMasVendidos: ProductoMasVendido[];
  ventasMensuales: VentaMensual[];
  ventasPorCategoria: VentasPorCategoria[];
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    dashboardData: null as DashboardData | null,
    loading: false,
    error: null as string | null,
    lastFetch: null as Date | null
  }),

  getters: {
    isDataAvailable: (state) => !!state.dashboardData,
    getProductosMasVendidos: (state) => state.dashboardData?.productosMasVendidos || [],
    getVentasMensuales: (state) => state.dashboardData?.ventasMensuales || [],
    getVentasPorCategoria: (state) => state.dashboardData?.ventasPorCategoria || [],
    getMetricas: (state) => state.dashboardData?.metricas || [],
    getLastUpdateTime: (state) => state.lastFetch ? new Date(state.lastFetch) : new Date(),
    getStats: (state) => {
      if (!state.dashboardData) return { users: 0, products: 0, orders: 0, revenue: 0 };
      return {
        users: state.dashboardData.totalUsuarios,
        products: state.dashboardData.totalProductos,
        orders: state.dashboardData.totalPedidos,
        revenue: state.dashboardData.ventasTotales
      };
    }
  },

  actions: {
    async fetchDashboardData() {
      const toast = useToast();
      this.loading = true;
      this.error = null;

      try {
        // Obtener el token de autorización
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        // Realizar la solicitud a la API
        const response = await axios.get('/api/Dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Guardar los datos en el estado
        this.dashboardData = response.data;
        this.lastFetch = new Date();

        return this.dashboardData;
      } catch (err: any) {
        console.error('Error al obtener datos del dashboard:', err);
        
        // Si el error es de autenticación, mostrar mensaje apropiado
        if (err.response?.status === 401 || err.response?.status === 403) {
          this.error = 'No tienes permisos para acceder a los datos del dashboard';
          toast.error('No tienes permisos para acceder a los datos del dashboard');
        } else {
          this.error = err.message || 'Error desconocido al cargar datos del dashboard';
          toast.error('Error al cargar los datos del dashboard');
          
          // Si estamos en desarrollo, usar datos de ejemplo para pruebas
          if (process.env.NODE_ENV === 'development') {
            console.log('Utilizando datos de ejemplo para desarrollo');
            await this.generateMockData();
          }
        }
        
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Generar datos de ejemplo para pruebas
    async generateMockData() {
      // Esta función solo debe usarse en desarrollo cuando la API falle
      this.dashboardData = {
        titulo: "Panel de Administración",
        descripcion: "Resumen del E-commerce",
        totalUsuarios: 45,
        totalProductos: 120,
        totalPedidos: 78,
        ventasTotales: 15480.75,
        ventasHoy: 890.50,
        ultimaActualizacion: new Date().toISOString(),
        metricas: [
          {
            nombre: "Usuarios",
            valor: "45",
            icono: "fa-users",
            colorClase: "bg-primary"
          },
          {
            nombre: "Productos",
            valor: "120",
            icono: "fa-box",
            colorClase: "bg-success"
          },
          {
            nombre: "Pedidos",
            valor: "78",
            icono: "fa-shopping-cart",
            colorClase: "bg-info"
          },
          {
            nombre: "Ventas Totales",
            valor: "15.480,75 €",
            icono: "fa-euro-sign",
            colorClase: "bg-warning"
          }
        ],
        productosMasVendidos: [
          {
            productoId: 1,
            nombre: "ALFOMBRA MULTICOLOR LANA-ALGODÓN",
            cantidadVendida: 24,
            totalVendido: 4799.76,
            urlImagen: "https://ixia.es/media/catalog/product/6/1/614920.jpg"
          },
          {
            productoId: 15,
            nombre: "ESPEJO MARCO DORADO MADERA DE PINO",
            cantidadVendida: 18,
            totalVendido: 2699.82,
            urlImagen: "https://ixia.es/media/catalog/product/6/1/610510.jpg"
          },
          {
            productoId: 5,
            nombre: "ALFOMBRA NATURAL YUTE",
            cantidadVendida: 15,
            totalVendido: 1799.85,
            urlImagen: "https://ixia.es/media/catalog/product/1/0/106830.jpg"
          },
          {
            productoId: 11,
            nombre: "PINTURA AFRICANA LIENZO",
            cantidadVendida: 12,
            totalVendido: 2639.88,
            urlImagen: "https://ixia.es/media/catalog/product/6/1/613361.jpg"
          },
          {
            productoId: 7,
            nombre: "ALFOMBRA OSO MARRÓN ALGODÓN INFANTIL",
            cantidadVendida: 10,
            totalVendido: 399.9,
            urlImagen: "https://ixia.es/media/catalog/product/6/0/608552.jpg"
          }
        ],
        ventasMensuales: [
          { mes: "Ene 2025", total: 1250.75 },
          { mes: "Feb 2025", total: 1780.50 },
          { mes: "Mar 2025", total: 2100.25 },
          { mes: "Abr 2025", total: 2450.80 },
          { mes: "May 2025", total: 2890.50 }
        ],
        ventasPorCategoria: [
          {
            categoriaId: 1,
            nombre: "Textil",
            total: 6999.61,
            porcentaje: 45.21
          },
          {
            categoriaId: 2,
            nombre: "Decoración vertical",
            total: 5339.70,
            porcentaje: 34.49
          },
          {
            categoriaId: 3,
            nombre: "Accesorio decorativo",
            total: 3141.44,
            porcentaje: 20.29
          }
        ]
      };
      
      this.lastFetch = new Date();
    }
  }
});