import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@/styles/main.scss';



import router from './router';
import { createPinia } from 'pinia';

const vuetify = createVuetify();
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(vuetify);
app.mount('#app');
