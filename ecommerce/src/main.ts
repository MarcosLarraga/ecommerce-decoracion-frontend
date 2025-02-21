import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

// Estilos globales
import '@/styles/main.scss';

// Vue Router y Pinia
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { useUserStore } from '@/stores/userStore';

// Crear instancia de Vuetify
const vuetify = createVuetify({
  components,
  directives,
});

// Crear Pinia y configurar persistencia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');

// Inicializar el store de usuario para restaurar sesión si existe
const userStore = useUserStore();
userStore.initialize();
