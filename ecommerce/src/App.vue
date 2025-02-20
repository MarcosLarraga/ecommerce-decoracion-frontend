<template>
  <v-app class="app">
    <NavBar />
    <div class="layout">
      <section class="content">
        <RouterView />
      </section>
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
@use '@/styles/main.scss';
@use '@/styles/variables' as *;

</style>
