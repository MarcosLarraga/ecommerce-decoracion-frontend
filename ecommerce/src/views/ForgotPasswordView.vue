<template>
  <div class="forgot-view">
    <!-- Imagen de fondo -->
    <div class="background-image"></div>

    <!-- Contenedor del formulario -->
    <div class="forgot">
      <h1 class="forgot__title">Olvidé mi contraseña</h1>
      <form class="forgot__form" @submit.prevent="handleForgotPassword">
        <div class="forgot__group">
          <label class="forgot__label" for="email">Email</label>
          <input 
            class="forgot__input" 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            :disabled="loading"
            placeholder="Introduce tu email"
          />
        </div>
        
        <button 
          class="forgot__button" 
          type="submit" 
          :disabled="loading || !isValidEmail"
        >
          {{ loading ? 'Enviando enlace...' : 'Enviar enlace' }}
        </button>
        
        <!-- Mensajes de estado -->
        <div v-if="message" class="forgot__message forgot__message--success">
          <i class="fas fa-check-circle"></i>
          {{ message }}
        </div>
        
        <div v-if="error" class="forgot__message forgot__message--error">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>
        
        <!-- Información adicional -->
        <div v-if="showAdditionalInfo" class="forgot__info">
          <h3>¿No recibes el email?</h3>
          <ul>
            <li>Revisa tu carpeta de spam o correo no deseado</li>
            <li>Asegúrate de que el email esté escrito correctamente</li>
            <li>El enlace expira en 1 hora por seguridad</li>
            <li>Si el problema persiste, contacta con nosotros</li>
          </ul>
        </div>
      </form>
      
      <div class="forgot__links">
        <router-link class="forgot__link" to="/login">
          <i class="fas fa-arrow-left"></i>
          Volver a iniciar sesión
        </router-link>
        <router-link class="forgot__link" to="/register">
          ¿No tienes cuenta? Regístrate
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const email = ref('');
const loading = ref(false);
const error = ref('');
const message = ref('');
const showAdditionalInfo = ref(false);
const attemptCount = ref(0);

const userStore = useUserStore();
const router = useRouter();

// Validación de email
const isValidEmail = computed(() => {
  const emailPattern = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email.value);
});

const handleForgotPassword = async () => {
  if (!isValidEmail.value) {
    error.value = 'Por favor, introduce un email válido';
    return;
  }

  loading.value = true;
  error.value = '';
  message.value = '';
  attemptCount.value++;

  try {
    // Llamar al método del store con mejor manejo de errores
    const success = await userStore.forgotPassword(email.value);
    
    if (success) {
      message.value = 'Se ha enviado un enlace para restablecer tu contraseña. Revisa tu email.';
      showAdditionalInfo.value = true;
      
      // Opcional: redirigir después de un tiempo
      setTimeout(() => {
        router.push('/login');
      }, 10000); // 10 segundos
    }
  } catch (e: any) {
    console.error('Error en forgot password:', e);
    
    // Manejar diferentes tipos de errores
    if (e.response?.status === 500) {
      error.value = 'Error interno del servidor. Por favor, inténtalo más tarde o contacta con soporte.';
    } else if (e.response?.status === 400) {
      error.value = e.response.data.message || 'Datos inválidos. Verifica tu email.';
    } else if (e.code === 'ERR_NETWORK') {
      error.value = 'Error de conexión. Verifica tu conexión a internet.';
    } else {
      error.value = e.message || 'Error inesperado. Inténtalo más tarde.';
    }
    
    // Mostrar información adicional después de varios intentos
    if (attemptCount.value >= 2) {
      showAdditionalInfo.value = true;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.forgot-view {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
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
.forgot {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  &__title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #333;
    font-weight: 600;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  &__label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }

  &__input {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ffc107;
      box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  &__button {
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #ffc107, #e0a800);
    color: #000;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #e0a800, #d39e00);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  &__message {
    padding: 1rem;
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &--success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    &--error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    i {
      font-size: 1.2rem;
    }
  }

  &__info {
    background-color: #e9ecef;
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 1rem;
    text-align: left;

    h3 {
      margin: 0 0 1rem 0;
      color: #495057;
      font-size: 1.1rem;
    }

    ul {
      margin: 0;
      padding-left: 1.2rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #6c757d;
        font-size: 0.9rem;
        line-height: 1.4;
      }
    }
  }

  &__links {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 123, 255, 0.1);
      color: #0056b3;
    }

    i {
      font-size: 0.9rem;
    }
  }
}

/* Media queries */
@media (max-width: 768px) {
  .forgot-view {
    padding: 0.5rem;
  }

  .forgot {
    padding: 1.5rem;
    max-width: 400px;

    &__title {
      font-size: 1.75rem;
    }

    &__links {
      gap: 0.75rem;
    }

    &__link {
      font-size: 0.9rem;
    }
  }
}

@media (max-width: 480px) {
  .forgot {
    padding: 1rem;
    margin: 0.5rem;

    &__title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    &__form {
      gap: 1rem;
    }

    &__message {
      padding: 0.75rem;
      font-size: 0.9rem;
    }

    &__info {
      padding: 1rem;
      
      h3 {
        font-size: 1rem;
      }
      
      ul li {
        font-size: 0.85rem;
      }
    }
  }
}</style>