import { createApp } from 'vue';
import App from './App.vue'; 

// Importación de Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@/styles/main.scss';
import '@mdi/font/css/materialdesignicons.css';

// Importar Vue Router y Pinia
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Crear la instancia de Vuetify
const vuetify = createVuetify({
  components,
  directives,
});

// Crear Pinia y configurar la persistencia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);  // Esta línea añade la persistencia

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');
