<template>
    <div class="reset">
      <h1 class="reset__title">Restablecer Contraseña</h1>
      <div v-if="!token">
        <p class="reset__error">Token no encontrado en la URL.</p>
      </div>
      <div v-else>
        <p class="reset__info">Token recibido: {{ token }}</p>
        <form class="reset__form" @submit.prevent="handleResetPassword">
          <div class="reset__group">
            <label class="reset__label" for="newPassword">Nueva Contraseña</label>
            <input class="reset__input" type="password" id="newPassword" v-model="newPassword" required />
          </div>
          <button class="reset__button" type="submit" :disabled="loading">
            {{ loading ? 'Restableciendo...' : 'Restablecer' }}
          </button>
        </form>
        <p v-if="message" class="reset__message">{{ message }}</p>
        <p v-if="error" class="reset__error">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  
  const token = ref(route.query.token as string || '');
  const newPassword = ref('');
  const loading = ref(false);
  const error = ref('');
  const message = ref('');
  
  const handleResetPassword = async () => {
    if (!token.value) {
      error.value = "Token no encontrado en la URL.";
      return;
    }
    loading.value = true;
    error.value = '';
    message.value = '';
    try {
      const res = await userStore.resetPassword(token.value, newPassword.value);
      message.value = res; // Se espera que la API devuelva un mensaje
      // Opcional: redirigir al login tras el éxito
      // router.push('/login');
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .reset {
    &__title {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    &__info {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #555;
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
      display: block;
      margin-bottom: 0.5rem;
    }
    &__input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    &__button {
      padding: 0.75rem;
      background-color: #17a2b8;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
    &__message {
      color: green;
      margin-top: 1rem;
    }
    &__error {
      color: red;
      margin-top: 1rem;
    }
  }
  </style>
  