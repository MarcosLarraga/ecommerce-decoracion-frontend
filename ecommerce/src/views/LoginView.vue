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
  // Rediriges a donde quieras luego de loguear, por ejemplo: 
  router.push('/');
};
</script>

<template>
  <!-- Reemplazamos v-container por un div para mayor control del 100% de la pantalla -->
  <div class="login-container d-flex justify-center align-center">
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

          <v-btn type="submit" block class="login-btn">
            Ingresar
          </v-btn>

          <p class="text-center mt-4">
            ¿No tienes cuenta?
            <router-link to="/register" class="register-link">
              Regístrate aquí
            </router-link>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.login-container {
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

.login-container::before {
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

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.register-link:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .login-card {
    max-width: 400px;
    padding: 40px;
  }
}
</style>
