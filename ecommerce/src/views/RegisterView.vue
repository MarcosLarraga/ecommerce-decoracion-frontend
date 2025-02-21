<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import Alerta from '@/components/Alerta.vue';

const nombre = ref('');
const email = ref('');
const password = ref('');
const alertMessage = ref('');
const alertType = ref(''); // 'success' o 'error'

const router = useRouter();
const store = useUserStore();

const rules = {
  required: (value: string) => !!value || 'Campo obligatorio',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(value) || 'Ingresa un correo válido';
  }
};

const register = async () => {
  if (!nombre.value || !email.value || !password.value) {
    alertType.value = 'error';
    alertMessage.value = 'Por favor, complete todos los campos.';
    setTimeout(() => {
      alertMessage.value = '';
    }, 10000);
    return;
  }
  
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
    alertMessage.value = store.error;
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
  <div class="register">
    <!-- Alerta -->
    <div class="register__alert">
      <Alerta :message="alertMessage" :type="alertType" @dismiss="clearAlert" />
    </div>

    <v-card class="register__card">
      <v-card-title class="register__title">Registrarse</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="nombre"
            label="Nombre"
            required
            :rules="[rules.required]"
            variant="outlined"
            class="register__input"
          ></v-text-field>
          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
            :rules="[rules.required, rules.email]"
            variant="outlined"
            class="register__input"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            required
            :rules="[rules.required]"
            variant="outlined"
            class="register__input"
          ></v-text-field>
          <v-btn type="submit" block class="register__btn">
            Registrarse
          </v-btn>
          <p class="register__text">
            ¿Ya tienes cuenta?
            <router-link to="/login" class="register__link">
              Inicia sesión aquí
            </router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
/* Mobile First */
.register {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
}

.register::before {
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

/* Alerta fija en la parte superior */
.register__alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.register__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.register__title {
  text-align: center;
}

.register__input {
  margin-bottom: 16px;
}

.register__btn {
  width: 100%;
}

.register__text {
  text-align: center;
  margin-top: 16px;
}

.register__link {
  color: blue;
}

.register__link:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .register__card {
    max-width: 400px;
    padding: 40px;
  }
}
</style>
