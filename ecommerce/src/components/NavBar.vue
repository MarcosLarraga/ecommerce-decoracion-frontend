<template>
  <v-app-bar app class="navbar">
    <v-container>
      <v-row align="center" justify="space-between" no-gutters>
        <!-- Logo -->
        <v-col cols="3" md="2">
          <router-link to="/" class="navbar__logo">
            <LogoCanvasBlack class="navbar__logo-img" />
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
          <router-link to="/shop" class="navbar__menu-item">Tienda</router-link>
          <router-link to="/guia" class="navbar__menu-item">Guia</router-link>
          <router-link to="/contacto" class="navbar__menu-item">Contacto</router-link>
        </v-col>

        <!-- Iconos de usuario y carrito en desktop -->
        <v-col cols="3" class="d-none d-md-flex justify-end navbar__icons">
          <template v-if="store.isAuthenticated && store.user">
            <span class="navbar__username">Bienvenido, {{ store.user.nombre }}</span>
            <v-btn icon class="navbar__icon" @click="logout">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <router-link to="/login" class="navbar__icon" @click="redirectToLogin">
              <v-icon>mdi-account</v-icon>
              <span class="navbar__login-text">Iniciar Sesión</span>
            </router-link>
          </template>
          <router-link to="/cart" class="navbar__icon navbar__cart">
            <v-icon>mdi-cart</v-icon>
            <span v-if="cartStore.totalItems > 0" class="cart-badge">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- Drawer para menú móvil -->
  <v-navigation-drawer v-model="drawer" app temporary right class="navbar__drawer">
    <v-list>
      <!-- Mostramos el nombre del usuario si está autenticado -->
      <v-list-item v-if="store.isAuthenticated && store.user">
        <v-list-item-content>
          <v-list-item-title class="navbar__drawer-username">
            Bienvenido, {{ store.user.nombre }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/" class="navbar__drawer-item" @click="drawer = false">
        Home
      </v-list-item>
      <v-list-item to="/shop" class="navbar__drawer-item" @click="drawer = false">
        Shop
      </v-list-item>
      <!-- Ruta "guia" si la tienes definida; sino, elimínala -->
      <v-list-item to="/guia" class="navbar__drawer-item" @click="drawer = false">
        Guia
      </v-list-item>
      <v-list-item to="/contacto" class="navbar__drawer-item" @click="drawer = false">
        Contacto
      </v-list-item>
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
  padding: $spacing-md 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid $primary-color;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: $text-color;
  }

  &__menu {
    display: none; // Oculto por defecto en móviles
    flex-direction: column;
    gap: 20px;
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

  &__login-text {
    margin-left: 0.5rem;
    font-size: 0.9rem;
    color: $text-color;
  }

  &__cart {
    position: relative;
  }
}

.v-navigation-drawer .v-list {
  margin-top: 10%;
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
