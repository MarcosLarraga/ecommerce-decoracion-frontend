<script setup>
import { ref } from 'vue';
import PageHero from '../components/PageHero.vue'
import SoporteInfo from '../components/SoporteInfo.vue'

const sections = ref([
  {
    title: "Nuestra Historia",
    icon: "fas fa-book-open",
    content: "Desde 2015, nos dedicamos a ofrecer productos de decoración únicos y de alta calidad. Cada pieza tiene una historia y un propósito.",
    highlight: "Más de 8 años transformando hogares"
  },
  {
    title: "Nuestra Misión",
    icon: "fas fa-heart",
    content: "Transformar cada hogar en un espacio acogedor y con estilo. Los pequeños detalles marcan la diferencia.",
    highlight: "Tu hogar, nuestra inspiración"
  },
  {
    title: "Nuestros Valores",
    icon: "fas fa-gem",
    content: "Calidad, sostenibilidad, innovación y atención personalizada son los pilares de nuestro trabajo.",
    highlight: "Comprometidos con la excelencia"
  },
  {
    title: "¿Por qué elegirnos?",
    icon: "fas fa-star",
    content: "Productos seleccionados por expertos, envíos rápidos, atención personalizada y materiales sostenibles.",
    highlight: "La diferencia está en los detalles",
    benefits: [
      { icon: "fas fa-search", title: "Productos Seleccionados", description: "Curación experta de cada artículo" },
      { icon: "fas fa-shipping-fast", title: "Envíos Express", description: "Entrega rápida y segura" },
      { icon: "fas fa-user-tie", title: "Atención Personal", description: "Asesoramiento especializado" },
      { icon: "fas fa-leaf", title: "Eco-Friendly", description: "Materiales sostenibles" }
    ]
  }
]);
</script>

<template>
  <div class="about">
    <PageHero title="Sobre Nosotros" imageSrc="/fotos/PageHero.jpg" />

    <!-- Introducción -->
    <div class="about__intro">
      <div class="about__intro-content">
        <h2 class="about__intro-title">Bienvenido a LM Decoraciones</h2>
        <p class="about__intro-text">
          Donde cada pieza cuenta una historia y transforma tu hogar en un espacio único.
        </p>
      </div>
    </div>

    <div class="about__content">
      <div v-for="(section, index) in sections" :key="index" class="about__section">
        
        <div class="section-wrapper">
          <div class="section-header">
            <div class="section-icon">
              <i :class="section.icon"></i>
            </div>
            <h2 class="about__title">{{ section.title }}</h2>
            <div class="section-highlight">{{ section.highlight }}</div>
          </div>
          
          <div class="section-content">
            <p class="about__text">{{ section.content }}</p>
            
            <!-- Grid de beneficios solo para la sección "¿Por qué elegirnos?" -->
            <div v-if="section.benefits" class="benefits-grid">
              <div v-for="benefit in section.benefits" :key="benefit.title" class="benefit-card">
                <div class="benefit-card__icon">
                  <i :class="benefit.icon"></i>
                </div>
                <h4 class="benefit-card__title">{{ benefit.title }}</h4>
                <p class="benefit-card__description">{{ benefit.description }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Call to Action sin fondo verde -->
    <div class="about__cta">
      <div class="about__cta-content">
        <h3 class="about__cta-title">¿Listo para transformar tu hogar?</h3>
        <p class="about__cta-text">Descubre nuestra colección y encuentra la inspiración que necesitas</p>
        <router-link to="/shop" class="about__cta-button">
          <i class="fas fa-shopping-bag"></i>
          Explorar Productos
        </router-link>
      </div>
    </div>

    <SoporteInfo />
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.about {
  .about__intro {
    background: white;
    padding: $spacing-lg 0;
    text-align: center;
    margin: $spacing-lg 0;
    border-radius: $border-radius-lg;
    border: 2px solid rgba($primary-color, 0.1);

    &-content {
      max-width: 500px;
      margin: 0 auto;
      padding: 0 $spacing-md;
    }

    &-title {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin-bottom: $spacing-md;
      font-family: $font-family-primary;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-xxl;
      }
    }

    &-text {
      font-size: $font-size-base;
      color: $text-color-secondary;
      line-height: 1.6;
      margin: 0;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-large;
      }
    }
  }

  &__content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }

  &__section {
    margin-bottom: $spacing-lg;
  }

  .section-wrapper {
    padding: $spacing-lg;
    border-radius: $border-radius-lg;
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba($border-color, 0.2);
    background: white;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: $breakpoint-md) {
      padding: $spacing-xl;
    }
  }

  .section-header {
    text-align: center;
    margin-bottom: $spacing-md;
  }

  .section-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
    border-radius: $border-radius-circle;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto $spacing-sm;
    box-shadow: 0 6px 20px rgba($primary-color, 0.25);

    i {
      font-size: 24px;
      color: white;
    }
  }

  &__title {
    font-size: $font-size-large;
    margin: 0 0 $spacing-xs;
    color: $text-color;
    font-family: $font-family-primary;
    font-weight: $font-weight-bold;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xl;
    }
  }

  .section-highlight {
    display: inline-block;
    background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-color, 0.05) 100%);
    color: $primary-color;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius;
    font-weight: $font-weight-semibold;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .section-content {
    text-align: center;
  }

  &__text {
    font-size: $font-size-base;
    line-height: 1.6;
    color: $text-color;
    margin-bottom: $spacing-md;
    font-weight: $font-weight-medium;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-large;
      margin-bottom: $spacing-lg;
    }
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-sm;
    margin-top: $spacing-md;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-md;
      max-width: none;
    }
  }

  .benefit-card {
    background: rgba($primary-color, 0.02);
    padding: $spacing-sm;
    border-radius: $border-radius;
    text-align: center;
    border: 1px solid rgba($primary-color, 0.1);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      background: rgba($primary-color, 0.05);
    }

    &__icon {
      width: 32px;
      height: 32px;
      background: rgba($primary-color, 0.1);
      border-radius: $border-radius-circle;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto $spacing-xs;

      i {
        font-size: 12px;
        color: $primary-color;
      }
    }

    &__title {
      font-size: 11px;
      font-weight: $font-weight-semibold;
      color: $text-color;
      margin: 0 0 $spacing-xs;
      line-height: 1.3;
    }

    &__description {
      font-size: 9px;
      color: $text-color-secondary;
      margin: 0;
      line-height: 1.2;
    }

    @media (min-width: $breakpoint-md) {
      padding: $spacing-md;

      &__icon {
        width: 45px;
        height: 45px;
        margin: 0 auto $spacing-sm;

        i {
          font-size: 16px;
        }
      }

      &__title {
        font-size: $font-size-small;
      }

      &__description {
        font-size: 12px;
      }
    }
  }

  // Call to Action sin fondo verde
  &__cta {
    background: white;
    padding: $spacing-lg 0;
    text-align: center;
    margin: $spacing-lg 0;
    border-radius: $border-radius-lg;
    border: 2px solid rgba($primary-color, 0.1);

    &-content {
      max-width: 500px;
      margin: 0 auto;
      padding: 0 $spacing-md;
    }

    &-title {
      font-size: $font-size-large;
      font-weight: $font-weight-bold;
      color: $text-color;
      margin: 0 0 $spacing-sm;

      @media (min-width: $breakpoint-md) {
        font-size: $font-size-xl;
      }
    }

    &-text {
      font-size: $font-size-base;
      color: $text-color-secondary;
      margin: 0 0 $spacing-md;
    }

    &-button {
      display: inline-flex;
      align-items: center;
      gap: $spacing-sm;
      background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
      color: white;
      padding: $spacing-sm $spacing-lg;
      border-radius: $border-radius;
      text-decoration: none;
      font-weight: $font-weight-semibold;
      font-size: $font-size-base;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba($primary-color, 0.4);
      }

      i {
        font-size: 14px;
      }
    }
  }
}
</style>