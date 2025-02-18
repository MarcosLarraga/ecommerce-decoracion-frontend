<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const rules = {
  required: (value: string) => !!value || 'Campo obligatorio',
  email: (value: string) =>
    /\S+@\S+\.\S+/.test(value) || 'Ingresa un correo válido',
};

const login = () => {
  console.log('Iniciando sesión con:', email.value, password.value);
  router.push('/');
};
</script>

<template>
  <v-container class="login-container d-flex justify-center align-center">
    <v-card class="login-card pa-6">
      <v-card-title class="text-center">Iniciar Sesión</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
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

          <v-btn type="submit" block class="login-btn">Ingresar</v-btn>

          <p class="text-center mt-4">
            ¿No tienes cuenta?
            <router-link to="/register" class="register-link">Regístrate aquí</router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style>
/* Contenedor del login con imagen de fondo */
.login-container {
  height: 100vh;
  background: url('/fotos/login-register.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

/* Filtro borroso para el fondo */
.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  z-index: -1;
}

/* Caja del formulario */
.login-card {
  position: relative;
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

/* Botón de Login */
.login-btn {
  background-color: #ff0000 !important; /* Reemplaza con tu color primario */
  color: white !important;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 8px; /* Reemplaza con tu variable de radio */
}

/* Enlace de Registro */
.register-link {
  color: #ff0000; /* Reemplaza con tu color primario */
  font-weight: bold;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

/* Responsive para pantallas más grandes */
@media (min-width: 768px) {
  .login-card {
    max-width: 400px;
    padding: 40px;
  }
}

@media (min-width: 1024px) {
  .login-container {
    padding: 50px;
  }
}
</style>
