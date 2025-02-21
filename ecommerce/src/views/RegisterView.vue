<template>
  <div class="register">
    <h1 class="register__title">Registrarse</h1>
    <form class="register__form" @submit.prevent="handleRegister">
      <div class="register__group">
        <label class="register__label" for="nombre">Nombre</label>
        <input class="register__input" type="text" id="nombre" v-model="nombre" required />
      </div>
      <div class="register__group">
        <label class="register__label" for="email">Email</label>
        <input class="register__input" type="email" id="email" v-model="email" required />
      </div>
      <div class="register__group">
        <label class="register__label" for="password">Contraseña</label>
        <input class="register__input" type="password" id="password" v-model="password" required />
      </div>
      <button class="register__button" type="submit" :disabled="loading">
        {{ loading ? 'Registrando...' : 'Registrarse' }}
      </button>
      <p v-if="error" class="register__error">{{ error }}</p>
    </form>
    <div class="register__links">
      <router-link class="register__link" to="/login">Ya tengo cuenta, iniciar sesión</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const nombre = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const userStore = useUserStore();
const router = useRouter();

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  await userStore.register(nombre.value, email.value, password.value);
  error.value = userStore.error;
  loading.value = false;
  if (!error.value) {
    router.push('/login');
  }
};
</script>

<style lang="scss" scoped>
.register {
  &__title { font-size: 2rem; margin-bottom: 1rem; }
  &__form { display: flex; flex-direction: column; max-width: 400px; }
  &__group { margin-bottom: 1rem; }
  &__label { margin-bottom: 0.5rem; display: block; }
  &__input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
  &__button { padding: 0.75rem; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; &:disabled { opacity: 0.6; } }
  &__error { color: red; margin-top: 1rem; }
  &__links { margin-top: 1rem; }
  &__link { color: #007bff; text-decoration: none; }
}
</style>
