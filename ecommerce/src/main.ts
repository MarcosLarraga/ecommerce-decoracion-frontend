// src/main.ts
import { createApp } from 'vue'
import App from './App.vue' 

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import '@/styles/main.scss'
import '@mdi/font/css/materialdesignicons.css'

import router from './router'
import { createPinia } from 'pinia'

import { useUserStore } from '@/stores/userStore'

const vuetify = createVuetify({
  components,
  directives
})

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(vuetify)

const userStore = useUserStore()
userStore.restoreSession()

app.mount('#app')
