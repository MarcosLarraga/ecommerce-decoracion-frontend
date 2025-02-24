<template>
  <div class="login">
    <h1 class="login__title">Iniciar Sesión</h1>
    <form class="login__form" @submit.prevent="handleLogin">
      <div class="login__group">
        <label class="login__label" for="email">Email</label>
        <input class="login__input" type="email" id="email" v-model="email" required />
      </div>
      <div class="login__group">
        <label class="login__label" for="password">Contraseña</label>
        <input class="login__input" type="password" id="password" v-model="password" required />
      </div>
      <button class="login__button" type="submit" :disabled="loading">
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
      <p v-if="error" class="login__error">{{ error }}</p>
    </form>
    <div class="login__links">
      <router-link class="login__link" to="/register">Registrarse</router-link>
      <router-link class="login__link" to="/forgot-password">Olvidé mi contraseña</router-link>
    </div>
    <!-- Componente para Google Sign-In -->
    <div class="login__google">
      <BotonGoogle />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import BotonGoogle from '@/components/BotonGoogle.vue';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const userStore = useUserStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  await userStore.login(email.value, password.value);
  error.value = userStore.error;
  loading.value = false;
  if (userStore.isAuthenticated) {
    router.push('/');
  }
};
</script>

<style lang="scss" scoped>
/* Tus estilos de login */
</style>
