<template>
  <v-app-bar app class="navbar">
    <v-container>
      <v-row align="center" justify="space-between" no-gutters>
        <!-- Logo -->
        <v-col cols="3" md="2">
          <router-link to="/" class="navbar__logo">
            <img src="/fotos/logoLMDecoracion.png" alt="Logo" class="navbar__logo-img" />
          </router-link>
        </v-col>

        <!-- Menú hamburguesa para móvil -->
        <v-col cols="8" class="d-flex justify-end align-center d-md-none">
          <v-btn icon class="navbar__hamburger" @click="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>

        <!-- Menú de navegación para pantallas grandes -->
        <v-col cols="6" class="d-none d-md-flex navbar__menu justify-center">
          <router-link to="/" class="navbar__menu-item">Home</router-link>
          <router-link to="/shop" class="navbar__menu-item">Shop</router-link>
          <router-link to="/about" class="navbar__menu-item">About</router-link>
          <router-link to="/contacto" class="navbar__menu-item">Contacto</router-link>
        </v-col>

        <!-- Iconos de usuario y carrito en desktop (con contador de productos) -->
        <v-col cols="3" class="d-none d-md-flex justify-end navbar__icons">
          <router-link to="/account" class="navbar__icon">
            <v-icon>mdi-account</v-icon>
          </router-link>
          <router-link to="/cart" class="navbar__icon navbar__cart">
            <v-icon>mdi-cart</v-icon>
            <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- Drawer para menú móvil con despliegue a la derecha -->
  <v-navigation-drawer v-model="drawer" app temporary right class="navbar__drawer">
    <v-list>
      <v-list-item to="/" class="navbar__drawer-item" @click="drawer = false">Home</v-list-item>
      <v-list-item to="/shop" class="navbar__drawer-item" @click="drawer = false">Shop</v-list-item>
      <v-list-item to="/about" class="navbar__drawer-item" @click="drawer = false">About</v-list-item>
      <v-list-item to="/contacto" class="navbar__drawer-item" @click="drawer = false">Contacto</v-list-item>
      <v-divider></v-divider>
      <v-list-item to="/account" class="navbar__drawer-item" @click="drawer = false">
        <v-icon left>mdi-account</v-icon> Mi Cuenta
      </v-list-item>
      <v-list-item to="/cart" class="navbar__drawer-item" @click="drawer = false">
        <v-icon left>mdi-cart</v-icon> Carrito
        <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';

const drawer = ref(false);
const cartStore = useCartStore();
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.navbar {
  background-color: $background-color;
  padding: $spacing-md 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid $primary-color;

  // Aumenta el margen del ícono del carrito
  .mdi-cart {
    margin-left: 50px !important;
  }

  &__logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $text-color;

    &-img {
      height: 45px;
      margin-right: $spacing-sm;
      border-radius: $border-radius;
    }
  }

  &__menu {
    display: flex;
    gap: 60px; // Espacio horizontal entre los enlaces
    align-items: center;

    &-item {
      text-decoration: none;
      color: $text-color;
      font-family: $font-family-primary;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: $primary-color;
      }
    }
  }

  &__hamburger {
    display: flex;
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 1rem; // Espacio entre íconos
  }

  &__icon {
    position: relative;
    color: #000 !important;
    transition: transform 0.2s ease-in-out;

    // Aumentar tamaño de íconos
    & v-icon {
      font-size: 28px !important; // Ajusta a tu gusto (28px, 32px, etc.)
    }

    &:hover {
      transform: scale(1.1);
      color: $primary-color; // Cambia de color al pasar el ratón
    }
  }

  &__cart {
    position: relative;
  }

  .cart-badge {
    position: absolute;
    top: -5px;
    right: -10px;
    background: red;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 4px 6px;
    border-radius: 50%;
    min-width: 20px;
    text-align: center;
  }
}

.v-navigation-drawer .v-list {
  margin-top: 10%;
}
</style>
