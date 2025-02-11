<template>
  <v-container class="home">
    <v-row class="home__hero">
      <v-col cols="12" md="6" class="home__content">
        <h1 class="home__title">Bienvenido a LM Decor</h1>
        <p class="home__subtitle">Explora nuestra colección exclusiva de decoración para el hogar.</p>
        <v-btn color="primary" class="home__cta" to="/productos">Ver Productos</v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-img src="@/assets/home-banner.jpg" alt="Decoración moderna" class="home__image"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.home {
  padding: $spacing-lg;

  &__hero {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;

    @include media-md {
      flex-direction: row;
      text-align: left;
    }
  }

  &__content {
    padding: $spacing-md;
  }

  &__title {
    font-size: $font-size-large;
    color: $primary-color;
    font-weight: bold;
  }

  &__subtitle {
    font-size: $font-size-base;
    color: $text-color;
    margin-top: $spacing-sm;
  }

  &__cta {
    margin-top: $spacing-md;
  }

  &__image {
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }
}
</style>