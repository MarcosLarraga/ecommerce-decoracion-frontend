<template>
  <v-app class="app">
    <NavBar />
    <v-main class="main">
      <SearchBar />
      <v-container fluid class="pa-0 ma-0">
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
import SearchBar from '@/components/SearchBar.vue';
</script>

<style lang="scss">
@use '@/styles/variables' as *;

.app {
  background-color: $background-color !important;
  color: $text-color;
}

.main {
  background-color: $background-color !important;
}

.v-main {
  padding-bottom: 0 !important;
}
</style>
