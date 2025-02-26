<template>
    <div class="perfil">
      <h1>Mi Perfil</h1>
      <form @submit.prevent="actualizarDatos">
        <label>Nombre</label>
        <input v-model="nombre" type="text" />
  
        <label>Email</label>
        <input v-model="email" type="email" />
  
        <label>Teléfono</label>
        <input v-model="telefono" type="text" />
  
        <label>Dirección</label>
        <input v-model="direccion" type="text" />
  
        <button type="submit">Actualizar</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  
  const userStore = useUserStore();
  const nombre = ref('');
  const email = ref('');
  const telefono = ref('');
  const direccion = ref('');
  
  onMounted(async () => {
    await userStore.fetchUserData();
    nombre.value = userStore.user.nombre;
    email.value = userStore.user.email;
    telefono.value = userStore.user.telefono;
    direccion.value = userStore.user.direccion;
  });
  
  const actualizarDatos = async () => {
    await userStore.updateUserData(nombre.value, email.value, direccion.value, telefono.value);
    alert("Datos actualizados correctamente");
  };
  </script>
  