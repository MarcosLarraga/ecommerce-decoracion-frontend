<script setup>
import PageHero from '@/components/PageHero.vue';
import SoporteInfo from '@/components/SoporteInfo.vue';
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Hero de la página -->
    <PageHero title="Sobre Nosotros" imageSrc="/fotos/PageHero.jpg" />

    <v-container class="about__container">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="6">
          <h2 class="about__title">Nuestra Historia</h2>
          <p class="about__text">
            En nuestra tienda, nos apasiona la decoración y el diseño de interiores. Desde nuestros inicios, hemos trabajado 
            para ofrecer productos únicos que reflejen la personalidad y el estilo de nuestros clientes.
          </p>
          
          <h2 class="about__title">Nuestra Misión</h2>
          <p class="about__text">
            Buscamos transformar cada hogar en un espacio acogedor y con estilo. Creemos que los pequeños detalles marcan la 
            diferencia y queremos ayudarte a encontrar esos complementos que harán de tu casa un hogar.
          </p>

          <h2 class="about__title">¿Por qué elegirnos?</h2>
          <p class="about__text">
            Productos seleccionados cuidadosamente <br>
            Envíos rápidos y seguros <br>
            Atención al cliente personalizada <br>
            Materiales sostenibles y ecológicos <br>
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Sección de soporte -->
    <SoporteInfo />
  </v-container>
</template>

<style lang="scss" scoped>
.about {
  &__container {
    flex-grow: 1;
    text-align: center;
    padding: 20px;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 30px;
  }

  &__text {
    font-size: 1rem;
    color: #666;
    margin-bottom: 20px;
    padding: 0 10px;
  }
}

@media (min-width: 768px) {
  .about {
    &__title {
      font-size: 1.8rem;
    }

    &__text {
      font-size: 1.2rem;
    }
  }
}

@media (min-width: 1024px) {
  .about {
    &__title {
      font-size: 2rem;
    }

    &__text {
      font-size: 1.3rem;
    }
  }
}
</style>
