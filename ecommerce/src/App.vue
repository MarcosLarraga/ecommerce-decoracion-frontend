<template>
  <v-app class="app">
    <NavBar />
    <v-main class="main">
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
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

.main {
  background-color: $background-color !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
