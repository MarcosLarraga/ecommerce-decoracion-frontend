<template>
  <v-app-bar app class="navbar">
    <v-container>
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <RouterLink to="/" class="navbar__logo">LM Decor</RouterLink>
        </v-col>

        <v-col cols="auto" class="d-none d-md-flex navbar__menu">
          <RouterLink v-for="item in menuItems" :key="item.text" :to="item.to" class="navbar__link">
            {{ item.text }}
          </RouterLink>
        </v-col>

        <v-col cols="auto">
          <v-btn icon class="navbar__cart">
            <v-icon>mdi-cart</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="auto" class="d-md-none">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list class="navbar__mobile-menu">
              <v-list-item v-for="item in menuItems" :key="item.text" :to="item.to">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { RouterLink } from 'vue-router';

const menuItems = [
  { text: 'Inicio', to: '/' },
  { text: 'Productos', to: '/catalogo' },
  { text: 'Consejos', to: '/consejos' },
  { text: 'Sobre Nosotros', to: '/about' },
  { text: 'Contacto', to: '/contacto' }
];
</script>

<style lang="scss">
@use '@/styles/variables' as *;

.navbar {
  background-color: $background-color !important;
  color: $text-color;
  padding: $spacing-sm 0;
  box-shadow: 0px 4px 6px rgba(255, 255, 255, 0.1);

  &__logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: $primary-color;
    text-decoration: none;
  }

  &__menu {
    display: flex;
    gap: $spacing-md;
  }

  &__link {
    color: $text-color;
    font-size: $font-size-base;
    font-weight: bold;
    padding: 0.5rem 1rem;
    text-decoration: none;

    &:hover {
      color: $primary-color;
    }
  }

  &__cart {
    background-color: transparent;
  }

  &__mobile-menu {
    background-color: $background-color;
  }
}
</style>
