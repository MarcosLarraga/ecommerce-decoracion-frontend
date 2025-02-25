<template>
    <div class="detalle">
      <h1 class="detalle__title">Detalles del Pedido</h1>
      <p><strong>Dirección:</strong> {{ userStore.user.direccion }}</p>
      <p><strong>Teléfono:</strong> {{ userStore.user.telefono }}</p>
  
      <h2>Productos Comprados</h2>
      <div class="detalle__productos">
        <div v-for="producto in pedido.productos" :key="producto.id">
          <p>{{ producto.name }} - {{ producto.price }}€</p>
          <button @click="dejarResena(producto.id)">Dejar Reseña</button>
        </div>
      </div>
    </div>
  </template>
  