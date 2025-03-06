<template>
  <div class="register-view">
    <!-- Imagen de fondo -->
    <div class="background-image"></div>

    <!-- Contenedor del formulario de registro -->
    <div class="auth">
      <h1 class="auth__title">Registrarse</h1>
      <Alerta v-if="error" :mensaje="error" />
      <form class="auth__form" @submit.prevent="handleRegister">
        <div class="auth__group">
          <label for="nombre" class="auth__label">Nombre</label>
          <input type="text" id="nombre" class="auth__input" v-model="nombre" required />
        </div>
        <div class="auth__group">
          <label for="email" class="auth__label">Email</label>
          <input type="email" id="email" class="auth__input" v-model="email" required />
        </div>
        <div class="auth__group">
          <label for="password" class="auth__label">Contraseña</label>
          <input type="password" id="password" class="auth__input" v-model="password" required />
        </div>
        <button type="submit" class="auth__button" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>
      <div class="auth__links">
        <router-link class="auth__link" to="/login">Ya tengo cuenta, iniciar sesión</router-link>
      </div>
      <div class="auth__google">
        <!-- Botón para registrarse con Google (usa el mismo flujo de login) -->
        <BotonGoogle v-if="!loading" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import Alerta from '../components/Alerta.vue';
import BotonGoogle from '../components/BotonGoogle.vue';

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
.register-view {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Imagen de fondo */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.3;
  z-index: 0;
}

/* Contenedor del formulario */
.auth {
  position: relative;
  z-index: 1;
  max-width: 400px;
  width: 90%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  text-align: center;
  margin: 1rem; /* margen vertical para evitar que toque los bordes en móviles */

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
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #0069d9;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &__links {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
  
  &__link {
    color: #007bff;
    text-decoration: none;
  }
  
  &__google {
    margin-top: 1.5rem;
  }
}

/* Media query para pantallas más grandes */
@media (min-width: 768px) {
  .auth {
    padding: 2rem;
  }
}
</style>
