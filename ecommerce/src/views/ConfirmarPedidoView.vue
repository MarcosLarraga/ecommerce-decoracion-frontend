<template>
  <div class="pedido">
    <h1 class="pedido__title">Confirmar Pedido</h1>

    <div class="pedido__user-info">
      <p><strong>Email:</strong> {{ userStore.user.email }}</p>
      <p v-if="userStore.user.telefono"><strong>Teléfono:</strong> {{ userStore.user.telefono }}</p>
      <p v-if="userStore.user.direccion"><strong>Dirección:</strong> {{ userStore.user.direccion }}</p>
    </div>

    <form class="pedido__form" @submit.prevent="confirmarPedido">
      <div class="pedido__form-group">
        <label class="pedido__label">Dirección de envío:</label>
        <input 
          v-model="direccion" 
          type="text" 
          required 
          class="pedido__input" 
          :placeholder="userStore.user?.direccion ? 'Usar misma dirección guardada' : 'Introduce tu dirección'" 
        />
      </div>

      <div class="pedido__form-group">
        <label class="pedido__label">Teléfono de contacto:</label>
        <input 
          v-model="telefono" 
          type="tel" 
          required 
          class="pedido__input" 
          :placeholder="userStore.user?.telefono ? 'Usar mismo teléfono guardado' : 'Introduce tu teléfono'"
        />
      </div>

      <div class="pedido__form-group" v-if="userStore.user.direccion || userStore.user.telefono">
        <label class="pedido__checkbox">
          <input type="checkbox" v-model="usarDatosGuardados" @change="actualizarDatosDesdeUsuario">
          Usar datos guardados en mi perfil
        </label>
      </div>

      <h2 class="pedido__subtitle">Productos en el pedido</h2>
      <div class="pedido__items" v-if="cartStore.cart.length > 0">
        <div class="pedido__item" v-for="item in cartStore.cart" :key="item.id">
          <img :src="item.image" :alt="item.name" class="pedido__item-image" />
          <div class="pedido__item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price.toFixed(2) }} €</p>
            <p>Cantidad: {{ item.quantity }}</p>
          </div>
        </div>
      </div>

      <h2 class="pedido__total">Total: {{ cartStore.cartTotal.toFixed(2) }} €</h2>

      <button type="submit" class="pedido__confirm-btn" :disabled="isSubmitting || !datosValidos">
        {{ isSubmitting ? 'Procesando...' : 'Confirmar Pedido' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { usePedidoStore } from '../stores/pedidoStore'
import { useDetallePedidoStore } from '../stores/detallePedidoStore'
import { useCartStore } from '../stores/cartStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const pedidoStore = usePedidoStore()
const detallePedidoStore = useDetallePedidoStore()
const cartStore = useCartStore()
const router = useRouter()
const toast = useToast()

// Inicializar con valores vacíos para forzar al usuario a confirmar los datos
const direccion = ref('');
const telefono = ref('');
const usarDatosGuardados = ref(false);
const isSubmitting = ref(false);

// Comprobar si los datos son válidos para habilitar el botón
const datosValidos = computed(() => {
  return direccion.value.trim() !== '' && telefono.value.trim() !== '';
});

// Función para cargar los datos del usuario en los campos
const actualizarDatosDesdeUsuario = () => {
  if (usarDatosGuardados.value) {
    direccion.value = userStore.user?.direccion || '';
    telefono.value = userStore.user?.telefono || '';
  } else {
    direccion.value = '';
    telefono.value = '';
  }
};

// Al montar el componente, verificar si hay datos guardados
onMounted(() => {
  // Si el usuario ya tiene dirección y teléfono, marcamos la casilla automáticamente
  if (userStore.user?.direccion && userStore.user?.telefono) {
    usarDatosGuardados.value = true;
    actualizarDatosDesdeUsuario();
  }
});

const confirmarPedido = async () => {
  if (cartStore.cart.length === 0) {
    toast.error("No puedes realizar un pedido sin productos en el carrito.")
    return
  }

  if (!datosValidos.value) {
    toast.error("Por favor, introduce dirección y teléfono para continuar.")
    return
  }

  isSubmitting.value = true

  try {
    // Primero actualizamos los datos de contacto
    await userStore.updateUserPhoneAndAddress(telefono.value, direccion.value)
    console.log("Datos de contacto actualizados correctamente")

    // Luego creamos el pedido
    const pedidoId = await pedidoStore.crearPedidoConDetalles(
      userStore.user.id,
      cartStore.cart,
      cartStore.cartTotal
    )

    // Después de crear el pedido, agregamos los detalles
    await detallePedidoStore.agregarDetallesPedido(pedidoId, cartStore.cart)

    toast.success("¡Pedido realizado con éxito!")
    router.push(`/pedido-detalle/${pedidoId}`)
  } catch (error) {
    console.error("Error al confirmar el pedido:", error)
    toast.error("Error al procesar el pedido. Por favor, inténtalo de nuevo.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;


.pedido {
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  @media (min-width: $breakpoint-sm) {
    padding: $spacing-lg;
    margin: 3rem auto;
  }

  @media (min-width: $breakpoint-md) {
    padding: $spacing-xl;
    margin: 4rem auto;
  }

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
    color: $primary-color;
    text-align: center;
    font-weight: 700;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-xl;
    }
  }

  &__user-info {
    background-color: $tertiary-color;
    padding: $spacing-md;
    border-radius: $border-radius;
    margin-bottom: $spacing-lg;

    p {
      margin: 0.5rem 0;
      font-size: $font-size-base;

      strong {
        color: $primary-color;
      }
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__form-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__label {
    font-weight: 600;
    font-size: $font-size-base;
    color: $text-color;
  }

  &__checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
      margin-right: $spacing-xs;
    }
  }

  &__input {
    padding: $input-padding;
    border: $input-border;
    border-radius: $input-border-radius;
    font-size: $font-size-base;
    font-family: $font-family-secondary;
    transition: border $transition-fast;

    &:focus {
      outline: none;
      border: $input-focus-border;
    }
  }

  &__subtitle {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin: $spacing-lg 0 $spacing-md;
    color: $primary-color;
    font-weight: 600;
    border-bottom: 2px solid $tertiary-color;
    padding-bottom: $spacing-xs;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__item {
    display: flex;
    align-items: center;
    background-color: $tertiary-color;
    padding: $spacing-md;
    border-radius: $border-radius;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    @media (max-width: $breakpoint-sm - 1) {
      flex-direction: column;
      align-items: flex-start;
    }

    &-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: $border-radius;

      @media (max-width: $breakpoint-sm - 1) {
        margin-bottom: $spacing-sm;
      }
    }

    &-info {
      flex: 1;
      padding: 0 $spacing-md;

      h3 {
        font-family: $font-family-primary;
        font-size: $font-size-base;
        margin: 0 0 $spacing-xs;
        color: $text-color;
      }

      p {
        margin: 0;
        font-size: $font-size-small;
        color: $text-color-secondary;

        &:first-of-type {
          color: $primary-color;
          font-weight: 600;
        }
      }
    }
  }

  &__total {
    font-family: $font-family-primary;
    font-size: $cart-total-price-size;
    color: $primary-color;
    text-align: right;
    margin: $spacing-lg 0;
    font-weight: 700;
  }

  &__confirm-btn {
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    padding: $spacing-md;
    font-size: $font-size-large;
    font-weight: 600;
    border-radius: $button-radius;
    cursor: pointer;
    transition: background-color $transition-normal, transform $transition-fast;
    box-shadow: $button-shadow;
    margin-top: $spacing-lg;

    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
      transform: translateY(-2px);
      box-shadow: $button-hover-shadow;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background-color: $text-color-secondary;
      cursor: not-allowed;
    }
  }
}
</style>