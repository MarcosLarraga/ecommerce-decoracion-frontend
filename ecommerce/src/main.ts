import { createApp } from 'vue';
import App from './App.vue'; // ✅ Corrección aquí

// ✅ Importación correcta de Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// ✅ Importar estilos de Vuetify
import 'vuetify/styles';

// ✅ Importar tu archivo global de estilos
import '@/styles/main.scss';
import '@mdi/font/css/materialdesignicons.css';


// ✅ Importar Vue Router y Pinia
import router from './router';
import { createPinia } from 'pinia';

// ✅ Crear la instancia de Vuetify con componentes y directivas
const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');
