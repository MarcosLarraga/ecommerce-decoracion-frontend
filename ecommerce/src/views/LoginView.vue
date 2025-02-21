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
    <div class="login__google">
      <button class="login__google-button" @click="handleGoogleLogin">
        Iniciar sesión con Google
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

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

const handleGoogleLogin = async () => {
  // Aquí deberías integrar la obtención del idToken real, por ejemplo usando Google Sign-In
  const dummyIdToken = 'eyJhbGciOi...'; // Reemplázalo por un token real
  loading.value = true;
  await userStore.googleLogin(dummyIdToken);
  loading.value = false;
  if (userStore.isAuthenticated) {
    router.push('/');
  }
};
</script>

<style lang="scss" scoped>
.login {
  &__title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  &__form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
  }
  &__group {
    margin-bottom: 1rem;
  }
  &__label {
    margin-bottom: 0.5rem;
    display: block;
  }
  &__input {
    width: 100%;
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
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  &__error {
    color: red;
    margin-top: 1rem;
  }
  &__links {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
  }
  &__link {
    color: #007bff;
    text-decoration: none;
  }
  &__google {
    margin-top: 1rem;
  }
  &__google-button {
    padding: 0.75rem;
    background-color: #db4437;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
