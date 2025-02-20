<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import Alerta from '@/components/Alerta.vue'; // Asegúrate de que la ruta sea correcta

const nombre = ref('');
const email = ref('');
const password = ref('');
const alertMessage = ref('');
const alertType = ref(''); // 'success' o 'error'

const router = useRouter();
const store = useUserStore();

const rules = {
  required: (value: string) => !!value || 'Campo obligatorio',
  email: (value: string) =>
    /\S+@\S+\.\S+/.test(value) || 'Ingresa un correo válido',
};

const register = async () => {
  const userData = {
    nombre: nombre.value,
    email: email.value,
    password: password.value,
  };
  await store.register(userData);
  if (!store.error) {
    alertType.value = 'success';
    alertMessage.value = 'Registro exitoso. Por favor, inicia sesión.';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } else {
    alertType.value = 'error';
    alertMessage.value = 'Error en registro: ' + store.error;
    // Ocultar el mensaje de error después de 10 segundos
    setTimeout(() => {
      alertMessage.value = '';
    }, 10000);
  }
};

const clearAlert = () => {
  alertMessage.value = '';
};
</script>

<template>
  <div class="register-container d-flex justify-center align-center">
    <!-- Ubicación de la alerta por encima del card -->
    <div class="alert-top">
      <Alerta :message="alertMessage" :type="alertType" @dismiss="clearAlert" />
    </div>

    <v-card class="register-card pa-6">
      <v-card-title class="text-center">Registrarse</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="nombre"
            label="Nombre"
            required
            :rules="[rules.required]"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
            :rules="[rules.required, rules.email]"
            variant="outlined"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            required
            :rules="[rules.required]"
            variant="outlined"
          ></v-text-field>
          <v-btn type="submit" block class="register-btn">
            Registrarse
          </v-btn>
          <p class="text-center mt-4">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="login-link">
              Inicia sesión aquí
            </router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.register-container {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Importante para usar posicionamiento absoluto en los hijos */
}

.register-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 0;
}

.alert-top {
  position: absolute;
  top: 30px; /* Ajusta según tu preferencia */
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2; /* Para que quede sobre el card */
}

.register-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.login-link:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .register-card {
    max-width: 400px;
    padding: 40px;
  }
}
</style>
