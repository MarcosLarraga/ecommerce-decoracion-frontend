<template>
  <div class="pedido">
    <h1 class="pedido__title">Confirmar Pedido</h1>

    <p><strong>Correo:</strong> {{ userStore.user.email }}</p>

    <form class="pedido__form" @submit.prevent="confirmarPedido">
      <label>Dirección:</label>
      <input v-model="direccion" type="text" required />

      <label>Teléfono:</label>
      <input v-model="telefono" type="tel" required />

      <button type="submit" class="pedido__confirm-btn">Confirmar Pedido</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { usePedidoStore } from '@/stores/pedidoStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const pedidoStore = usePedidoStore();
const router = useRouter();

const direccion = ref(userStore.user.direccion || '');
const telefono = ref(userStore.user.telefono || '');

const confirmarPedido = async () => {
  await userStore.updateUserPhoneAndAddress(telefono.value, direccion.value);  // ✅ Método correcto
  await pedidoStore.confirmarPedido(userStore.user.id, direccion.value, telefono.value, [], 0);
  router.push("/pedido-detalle");
};
</script>
