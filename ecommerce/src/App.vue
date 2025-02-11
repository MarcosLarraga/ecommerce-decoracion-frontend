<template>
  <div class="app">
    <header class="header">
      <NavBar />
    </header>
    <main>
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app {
  background-color: $background-color;
  color: $text-color;
}

.header {
  background-color: $background-color;
  padding: 1rem;
  border-bottom: 2px solid $border-color;
}

main {
  min-height: 80vh;
}
</style>
