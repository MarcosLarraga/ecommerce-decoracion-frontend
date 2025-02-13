<template>
  <v-app class="app">
    <NavBar />
    <div class="layout">
      <v-main class="main">
        <v-container fluid class="content">
          <RouterView />
        </v-container>
      </v-main>
    </div>
    <Footer />
  </v-app>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
</script>

<style lang="scss">
@use '@/styles/variables' as *;

.app {
  background-color: $background-color !important;
  color: $text-color;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1; 
  background-color: $background-color !important;
}

.v-main {
  padding-bottom: 0 !important;
}


.content {
  flex-grow: 1;
  display: flex;
  align-items: center; /* Centra contenido si es necesario */
}
</style>
