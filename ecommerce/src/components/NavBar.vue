<template>
  <header class="navbar">
    <div class="navbar__container">
      <!-- Barra superior -->
      <div class="navbar__top">
        <!-- Buscador (izquierda) -->
        <div class="navbar__search">
          <input type="text" placeholder="Buscar producto" class="navbar__search-input">
        </div>
        
        <!-- Logo (centro) -->
        <div class="navbar__logo">
          <router-link to="/">
            <LogoCanvasBlack class="navbar__logo-img" />
          </router-link>
        </div>
        
        <!-- Iconos (derecha) -->
        <div class="navbar__icons">
          <router-link to="/login" class="navbar__icon" v-if="!store.isAuthenticated">
            <v-icon size="28">mdi-account</v-icon>
          </router-link>
          <div class="navbar__icon" v-else @click="logout">
            <v-icon size="28">mdi-account</v-icon>
          </div>
          <router-link to="/cart" class="navbar__icon navbar__cart">
            <v-icon size="28">mdi-cart</v-icon>
            <span v-if="cartStore.totalItems > 0" class="cart-badge">
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>
      </div>
      
      <!-- Separador horizontal -->
      <div class="navbar__divider"></div>
      
      <!-- Menú inferior -->
      <nav class="navbar__menu">
        <router-link to="/" class="navbar__menu-item">Home</router-link>
        <router-link to="/shop" class="navbar__menu-item">Tienda</router-link>
        <router-link to="/guia" class="navbar__menu-item">Guía</router-link>
        <router-link to="/contacto" class="navbar__menu-item">Contacto</router-link>
        <router-link to="/sobre-nosotros" class="navbar__menu-item">Sobre Nosotros</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';
import LogoCanvasBlack from '@/components/LogoCanvasBlack.vue';

const router = useRouter();
const store = useUserStore();
const cartStore = useCartStore();

const logout = (): void => {
  store.logout();
  router.push('/login');
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.navbar {
  width: 100%;
  background-color: $background-color;
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
  }
  
  &__search {
    flex: 1;
    max-width: 300px;
    
    &-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      background-color: #f5f5f5;
      border-radius: 4px;
      font-size: 15px;
      font-family: $font-family-primary;
      
      &::placeholder {
        color: #333;
      }
    }
  }
  
  &__logo {
    text-align: center;
    flex: 1;
    display: flex;
    justify-content: center;
    
    &-img {
      height: 110px;
      margin-top: 15px;
    }
  }
  
  &__icons {
    display: flex;
    gap: 24px;
    justify-content: flex-end;
    flex: 1;
    max-width: 300px;
    margin-left: 50px;
  }
  
  &__icon {
    color: #000 !important;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s ease-in-out;
    
    &:hover {
      transform: scale(1.1);
      color: $primary-color !important;
    }
  }
  
  &__cart {
    position: relative;
  }
  
  &__divider {
    height: 1px;
    background-color: #e0e0e0;
    width: 100%;
  }
  
  &__menu {
    display: flex;
    justify-content: center;
    gap: 60px;
    padding: 15px 0;
    
    &-item {
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

/* Responsive para móviles */
@media (max-width: 768px) {
  .navbar {
    &__top {
      flex-wrap: wrap;
    }
    
    &__search {
      order: 2;
      max-width: 100%;
      margin-top: 15px;
    }
    
    &__logo {
      order: 1;
      flex: 1;
      
      &-img {
        height: 60px;
      }
    }
    
    &__icons {
      order: 3;
      max-width: auto;
    }
    
    &__menu {
      flex-wrap: wrap;
      gap: 20px;
      
      &-item {
        font-size: 20px;
      }
    }
  }
}
</style>
