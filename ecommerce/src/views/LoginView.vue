<template>
  <div class="auth">
    <h1 class="auth__title">Iniciar Sesión</h1>
    <Alerta v-if="error" :mensaje="error" />
    <form class="auth__form" @submit.prevent="handleLogin">
      <div class="auth__group">
        <label for="email" class="auth__label">Email</label>
        <input type="email" id="email" class="auth__input" v-model="email" required />
      </div>
      <div class="auth__group">
        <label for="password" class="auth__label">Contraseña</label>
        <input type="password" id="password" class="auth__input" v-model="password" required />
      </div>
      <button type="submit" class="auth__button" :disabled="loading">
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>
    <div class="auth__links">
      <router-link class="auth__link" to="/register">Registrarse</router-link>
      <router-link class="auth__link" to="/forgot-password">Olvidé mi contraseña</router-link>
    </div>
    <div class="auth__google">
      <BotonGoogle v-if="!loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import Alerta from '@/components/Alerta.vue';
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

// Opcional: Watch para redirigir cuando el usuario se autentique
watch(() => userStore.isAuthenticated, (newVal) => {
  if (newVal) {
    router.push('/');
  }
});
</script>

<style lang="scss" scoped>
.auth {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
  margin-top: 10%;
  
  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  &__group {
    display: flex;
    flex-direction: column;
    text-align: left;
  }
  
  &__label {
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  &__input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  &__button {
    padding: 0.75rem;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #218838;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &__links {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
  }
  
  &__link {
    color: #007bff;
    text-decoration: none;
  }
  
  &__google {
    margin-top: 1.5rem;
  }
}
</style>
