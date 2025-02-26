<template>
  <v-app-bar app class="navbar">
    <v-container>
      <!-- Desktop: visible para pantallas md y mayores -->
      <v-row align="center" justify="space-between" no-gutters class="d-none d-md-flex">
        <!-- Logo -->
        <v-col md="2">
          <router-link to="/" class="navbar__logo">
            <LogoCanvasBlack class="navbar__logo-img" />
          </router-link>
        </v-col>

        <!-- Menú de navegación (Texto) -->
        <v-col md="7" class="d-flex navbar__menu justify-center">
          <router-link to="/" class="navbar__menu-item">Home</router-link>
          <router-link to="/shop" class="navbar__menu-item">Tienda</router-link>
          <router-link to="/guia" class="navbar__menu-item">Guía</router-link>
          <router-link to="/contacto" class="navbar__menu-item">Contacto</router-link>
          <router-link to="/sobre-nosotros" class="navbar__menu-item">Sobre Nosotros</router-link>
        </v-col>

        <!-- Sección de SearchBar e Iconos -->
        <v-col md="3" class="d-flex justify-end align-center">
          <div class="navbar__search-inline">
            <SearchBar />
          </div>
          <div class="navbar__icons">
            <template v-if="store.isAuthenticated && store.user">
              <span class="navbar__username">Bienvenido, {{ store.user.nombre }}</span>
              <v-btn icon class="navbar__icon" @click="logout">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </template>
            <template v-else>
              <router-link to="/login" class="navbar__icon" @click="redirectToLogin">
                <v-icon>mdi-account</v-icon>
              </router-link>
            </template>
            <router-link to="/cart" class="navbar__icon navbar__cart">
              <v-icon>mdi-cart</v-icon>
              <span v-if="cartStore.totalItems > 0" class="cart-badge">
                {{ cartStore.totalItems }}
              </span>
            </router-link>
          </div>
        </v-col>
      </v-row>

      <!-- Mobile: visible para pantallas menores a md -->
      <v-row align="center" justify="space-between" no-gutters class="d-md-none">
        <!-- Logo a la izquierda -->
        <v-col cols="2" class="d-flex align-center">
          <router-link to="/" class="navbar__logo">
            <LogoCanvasBlack class="navbar__logo-img" />
          </router-link>
        </v-col>

        <!-- Buscador centrado -->
        <v-col cols="8" class="d-flex align-center justify-center">
          <div class="navbar__search-inline">
            <SearchBar />
          </div>
        </v-col>

        <!-- Botón hamburguesa a la derecha -->
        <v-col cols="2" class="d-flex justify-end align-center">
          <v-btn icon class="navbar__hamburger" @click="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- Drawer para móvil -->
  <v-navigation-drawer v-model="drawer" app temporary right class="navbar__drawer">
    <v-list>
      <v-list-item v-if="store.isAuthenticated && store.user">
        <v-list-item-content>
          <v-list-item-title class="navbar__drawer-username">
            Bienvenido, {{ store.user.nombre }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/" class="navbar__drawer-item" @click="drawer = false">Home</v-list-item>
      <v-list-item to="/shop" class="navbar__drawer-item" @click="drawer = false">Shop</v-list-item>
      <v-list-item to="/guia" class="navbar__drawer-item" @click="drawer = false">Guía</v-list-item>
      <v-list-item to="/contacto" class="navbar__drawer-item" @click="drawer = false">Contacto</v-list-item>
      <v-list-item to="/sobre-nosotros" class="navbar__drawer-item" @click="drawer = false">Sobre Nosotros</v-list-item>
      <v-divider></v-divider>
      <v-list-item v-if="store.isAuthenticated" class="navbar__drawer-item" @click="handleLogout">
        <v-icon left>mdi-logout</v-icon> Cerrar Sesión
      </v-list-item>
      <v-list-item v-else class="navbar__drawer-item" @click="redirectToLogin">
        <v-icon left>mdi-account</v-icon> Iniciar Sesión
      </v-list-item>
      <v-list-item to="/cart" class="navbar__drawer-item" @click="drawer = false">
        <v-icon left>mdi-cart</v-icon> Carrito
        <span v-if="cartStore.totalItems > 0" class="cart-badge">
          {{ cartStore.totalItems }}
        </span>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import LogoCanvasBlack from '@/components/LogoCanvasBlack.vue';
import SearchBar from '@/components/SearchBar.vue';

const drawer = ref(false);
const router = useRouter();
const store = useUserStore();
const cartStore = useCartStore();

const redirectToLogin = () => {
  router.push('/login');
};

const logout = () => {
  store.logout();
  router.push('/login');
};

const handleLogout = () => {
  logout();
  drawer.value = false;
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.navbar {
  background-color: $background-color;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid $primary-color;
  padding: $spacing-md 0;

  &__logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $text-color;
  }

  &__logo-img {
    height: 85px;
    margin-right: 8px;
    border-radius: 8px;
    margin-top: 15px;
  }

  &__menu {
    display: flex;
    gap: 60px;
    align-items: center;
  }

  &__menu-item {
    text-decoration: none;
    color: $text-color;
    font-family: $font-family-primary;
    font-size: 25px;
    font-weight: 600;
    letter-spacing: 0.5px;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: $primary-color;
    }
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 50px;

    .navbar__username {
      margin-right: $spacing-sm;
      font-weight: bold;
      color: $text-color;
    }
  }

  &__icon {
    position: relative;
    color: #000 !important;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.1);
      color: $primary-color;
    }
  }
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
</style>
