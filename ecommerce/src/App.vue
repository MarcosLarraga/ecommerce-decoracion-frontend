<template>
  <header>
    <NavBar />
  </header>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
</script>

<style scoped lang="scss">
@import '@/styles/variables';

header {
  background-color: $background-color;
  padding: 1rem;
}
</style>
