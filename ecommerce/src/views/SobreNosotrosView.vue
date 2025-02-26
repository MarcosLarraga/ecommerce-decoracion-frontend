<script setup>
import PageHero from '@/components/PageHero.vue';
import SoporteInfo from '@/components/SoporteInfo.vue';
</script>

<template>
  <v-container fluid class="pa-0">
    <PageHero title="Sobre Nosotros" imageSrc="/fotos/PageHero.jpg" />

    <v-container class="about__container">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="6">
          <h2 class="about__title">Nuestra Historia</h2>
          <p class="about__text">
            Desde nuestros inicios, nos hemos dedicado a ofrecer productos de decoración únicos y de alta calidad. Nuestra 
            pasión por el diseño de interiores nos llevó a crear una tienda donde cada pieza tiene una historia y un propósito.
          </p>
          
          <h2 class="about__title">Nuestra Misión</h2>
          <p class="about__text">
            Buscamos transformar cada hogar en un espacio acogedor y con estilo. Creemos que los pequeños detalles marcan la 
            diferencia y queremos ayudarte a encontrar esos complementos que harán de tu casa un hogar.
          </p>
          
          <h2 class="about__title">Nuestros Valores</h2>
          <p class="about__text">
            - Calidad: Seleccionamos productos cuidadosamente para garantizar que sean duraderos y de buen gusto.<br>
            - Sostenibilidad: Nos comprometemos con materiales ecológicos y procesos responsables con el medio ambiente.<br>
            - Innovación: Siempre buscamos tendencias y diseños que aporten un toque único a tu hogar.<br>
            - Atención al Cliente: Nos preocupamos por cada detalle de tu compra y brindamos una atención personalizada.<br>
          </p>
          
          <h2 class="about__title">Nuestro Equipo</h2>
          <p class="about__text">
            Contamos con un equipo de expertos en diseño de interiores y decoración que trabajan cada día para ofrecerte 
            los mejores productos y asesoramiento personalizado. Nos enorgullece formar parte de tu hogar a través de 
            nuestros productos.
          </p>
          
          <h2 class="about__title">¿Por qué elegirnos?</h2>
          <p class="about__text">
            - Productos seleccionados cuidadosamente <br>
            - Envíos rápidos y seguros <br>
            - Atención al cliente personalizada <br>
            - Materiales sostenibles y ecológicos <br>
            - Diseños exclusivos y en tendencia <br>
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
