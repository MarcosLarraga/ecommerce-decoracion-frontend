<template>
    <div class="forgot">
      <h1 class="forgot__title">Olvidé mi contraseña</h1>
      <form class="forgot__form" @submit.prevent="handleForgotPassword">
        <div class="forgot__group">
          <label class="forgot__label" for="email">Email</label>
          <input class="forgot__input" type="email" id="email" v-model="email" required />
        </div>
        <button class="forgot__button" type="submit" :disabled="loading">
          {{ loading ? 'Enviando enlace...' : 'Enviar enlace' }}
        </button>
        <p v-if="message" class="forgot__message">{{ message }}</p>
        <p v-if="error" class="forgot__error">{{ error }}</p>
      </form>
      <div class="forgot__links">
        <router-link class="forgot__link" to="/login">Volver a iniciar sesión</router-link>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const loading = ref(false);
  const error = ref('');
  const message = ref('');
  const userStore = useUserStore();
  const router = useRouter();
  
  const handleForgotPassword = async () => {
    loading.value = true;
    error.value = '';
    message.value = '';
    try {
      const res = await userStore.forgotPassword(email.value);
      message.value = res;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .forgot {
    &__title { font-size: 2rem; margin-bottom: 1rem; }
    &__form { display: flex; flex-direction: column; max-width: 400px; }
    &__group { margin-bottom: 1rem; }
    &__label { display: block; margin-bottom: 0.5rem; }
    &__input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
    &__button { padding: 0.75rem; background-color: #ffc107; color: #000; border: none; border-radius: 4px; cursor: pointer; &:disabled { opacity: 0.6; } }
    &__message { color: green; margin-top: 1rem; }
    &__error { color: red; margin-top: 1rem; }
    &__links { margin-top: 1rem; }
    &__link { color: #007bff; text-decoration: none; }
  }
  </style>
  