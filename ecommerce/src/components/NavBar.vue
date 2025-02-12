<template>
  <v-app-bar app class="navbar">
    <v-container>
      <v-row align="center" justify="space-between" no-gutters>
        <!-- Logo -->
        <v-col cols="4" md="2">
          <router-link to="/" class="navbar__logo">
            <img src="/fotos/logoLMDecoracion.png" alt="Logo" class="navbar__logo-img" />
            <span class="navbar__logo-text">Decoración</span>
          </router-link>
        </v-col>

        <!-- Menú hamburguesa para móvil -->
        <v-col cols="4" class="d-flex d-md-none navbar__hamburger">
          <v-btn icon @click="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>

        <!-- Menú de navegación para pantallas grandes -->
        <v-col cols="4" class="d-none d-md-flex navbar__menu">
          <router-link to="/" class="navbar__menu-item">Home</router-link>
          <router-link to="/shop" class="navbar__menu-item">Shop</router-link>
          <router-link to="/about" class="navbar__menu-item">About</router-link>
          <router-link to="/contact" class="navbar__menu-item">Contact</router-link>
        </v-col>

        <!-- Iconos de usuario y carrito -->
        <v-col cols="4" md="2" class="navbar__icons">
          <v-btn icon>
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-cart</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- Drawer para menú móvil -->
  <v-navigation-drawer v-model="drawer" app temporary class="navbar__drawer">
    <v-list>
      <v-list-item to="/" class="navbar__drawer-item">Home</v-list-item>
      <v-list-item to="/shop" class="navbar__drawer-item">Shop</v-list-item>
      <v-list-item to="/about" class="navbar__drawer-item">About</v-list-item>
      <v-list-item to="/contact" class="navbar__drawer-item">Contact</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
const drawer = ref(false);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.navbar {
  background-color: $background-color;
  padding: $spacing-md 0;
  box-shadow: $box-shadow;
  border-bottom: 1px solid $border-color;

  &__logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $text-color;

    &-img {
      height: 40px;
      margin-right: $spacing-sm;
      border-radius: $border-radius;
    }

    &-text {
      font-family: $font-family-primary;
      font-size: $font-size-base;
    }
  }

  &__menu {
    display: flex;
    gap: $spacing-lg;

    &-item {
      text-decoration: none;
      color: $text-color;
      font-family: $font-family-primary;
      font-size: $font-size-base;
      transition: color 0.3s;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius;

      &:hover {
        color: $primary-color;
        background-color: rgba($primary-color, 0.1);
      }
    }
  }

  &__icons {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
  }

  &__hamburger {
    display: flex;
    justify-content: flex-end;
  }

  &__drawer {
    background-color: $background-color;
    padding: $spacing-md;

    &-item {
      text-decoration: none;
      color: $text-color;
      font-size: $font-size-large;
      padding: $spacing-sm 0;
      font-family: $font-family-primary;

      &:hover {
        color: $primary-color;
      }
    }
  }
}
</style>
