<!-- Footer.vue (actualizado con enlaces funcionales) -->
<template>
  <v-footer app class="footer">
    <v-container>
      <v-row justify="center" class="footer__content">
        <v-col cols="12" md="3" class="footer__section">
          <nav class="footer__nav">
            <router-link to="/shop" class="footer__link">Tienda</router-link>
            <router-link to="/guia" class="footer__link">Guía</router-link>
            <router-link to="/contacto" class="footer__link">Contacto</router-link>
            <router-link to="/sobre-nosotros" class="footer__link">Sobre LM</router-link>
          </nav>
        </v-col>
        
        <v-col cols="12" md="3" class="footer__section footer__logo">
          <router-link to="/">
            <LogoCanvasWhite class="footer__logo-img" />
          </router-link>
        </v-col>
        
        <v-col cols="12" md="3" class="footer__section footer__social">
          <a href="https://www.instagram.com/lmdecoracionsocial" target="_blank" rel="noopener noreferrer" class="footer__icon">
            <div class="footer__icon-wrapper">
              <i class="fab fa-instagram"></i>
            </div>
          </a>
          <a href="https://www.linkedin.com/company/lmdecoracionsocial" target="_blank" rel="noopener noreferrer" class="footer__icon">
            <div class="footer__icon-wrapper">
              <i class="fab fa-linkedin-in"></i>
            </div>
          </a>
          <a href="https://www.youtube.com/@lmdecoracionsocial" target="_blank" rel="noopener noreferrer" class="footer__icon">
            <div class="footer__icon-wrapper">
              <i class="fab fa-youtube"></i>
            </div>
          </a>
          <a href="https://twitter.com/lmdecoracionsocial" target="_blank" rel="noopener noreferrer" class="footer__icon">
            <div class="footer__icon-wrapper">
              <i class="fab fa-twitter"></i>
            </div>
          </a>
        </v-col>
      </v-row>
      
      <v-divider class="footer__divider"></v-divider>
      
      <v-row justify="center" class="footer__bottom">
        <v-col cols="12" class="text-center">
          <div class="footer__copyright">
            2025 LM DECORACIONES. All rights reserved
          </div>
          <div class="footer__admin-access">
            <router-link to="/admin-login" class="footer__link footer__link--admin">
              Acceso trabajadores
            </router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import LogoCanvasWhite from '../components/LogoCanvasWhite.vue'
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
 
.v-footer {
  position: relative !important;
}

.footer {
  background-color: $secondary-color;
  color: $background-color;
  padding: $spacing-lg 0;
  text-align: center;
  width: 100%;
  margin-top: auto;
  
  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  &__section {
    text-align: center;
  }
  
  &__nav {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
  }
  
  &__link {
    text-decoration: none;
    color: $background-color;
    font-size: $font-size-base;
    transition: color 0.3s;
    &:hover {
      color: $primary-color;
    }
    &--admin {
      font-size: $font-size-small;
      opacity: 0.7;
      &:hover {
        opacity: 1;
      }
    }
  }
  
  &__logo {
    a {
      display: inline-block;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  &__logo-img {
    height: 50px;
    margin-bottom: $spacing-sm;
  }
  
  &__social {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
  }
  
  &__icon {
    text-decoration: none;
    display: inline-block;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
      
      .footer__icon-wrapper {
        background-color: rgba($primary-color, 0.1);
        
        i {
          color: $primary-color;
        }
      }
    }
  }
  
  &__icon-wrapper {
    width: 50px;
    height: 50px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    i {
      font-size: 20px;
      color: #333;
      transition: color 0.3s ease;
    }
  }
  
  &__divider {
    margin: $spacing-md auto;
    width: 90%;
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  &__bottom {
    margin-top: $spacing-md;
  }
  
  &__copyright {
    font-size: $font-size-small;
    margin-bottom: $spacing-sm;
  }
  
  &__admin-access {
    margin-top: $spacing-xs;
    opacity: 0.6;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>