<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import PopupAlert from '@/components/Alerta.vue';

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

const login = async () => {
  if (!email.value || !password.value) {
    alertType.value = 'error';
    alertMessage.value = 'Por favor, complete todos los campos.';
    setTimeout(() => {
      alertMessage.value = '';
    }, 10000);
    return;
  }

  console.log('Iniciando sesión con:', email.value, password.value);
  await store.login({ email: email.value, password: password.value });

  if (store.user) {
    router.push('/');
  } else {
    alertType.value = 'error';
    alertMessage.value = 'Correo o contraseña incorrectos';
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
  <div class="login">
    <!-- Contenedor para la alerta fijo en la parte superior -->
    <div class="login__alert">
      <PopupAlert :message="alertMessage" :type="alertType" @dismiss="clearAlert" />
    </div>
    <v-card class="login__card">
      <v-card-title class="login__title">Iniciar Sesión</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
            :rules="[rules.required, rules.email]"
            variant="outlined"
            class="login__input"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            required
            :rules="[rules.required]"
            variant="outlined"
            class="login__input"
          ></v-text-field>
          <v-btn type="submit" block class="login__submit-btn">
            Ingresar
          </v-btn>
          <p class="login__text">
            ¿No tienes cuenta?
            <router-link to="/register" class="login__register-link">
              Regístrate aquí
            </router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>

.login {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.login::before {
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

.login__alert {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}

.login__card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.login__title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.login__input {
  margin-bottom: 16px;
}

.login__submit-btn {
  width: 100%;
}

.login__text {
  text-align: center;
  margin-top: 16px;
}

.login__register-link {
  color: blue;
}

.login__register-link:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .login__card {
    max-width: 400px;
    padding: 30px;
  }
}
</style>
