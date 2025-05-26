<template>
  <div class="home">
    <!-- Hero Section con Carrusel -->
    <section class="home__hero">
      <v-carousel 
        height="100vh" 
        show-arrows="hover" 
        cycle 
        hide-delimiter-background 
        class="home__carousel"
        interval="5000"
      >
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <div class="home__slide">
            <div class="home__slide-overlay"></div>
            <img :src="slide.image" class="home__slide-image" alt="Carrusel" />
            <div class="home__slide-content">
              <div class="home__slide-text">
                <h1 class="home__slide-title">{{ slide.text }}</h1>
                <div class="home__slide-cta">
                  <button class="btn-primary" @click="router.push('/shop')">
                    <span>Descubrir</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
      
      <!-- Scroll indicator -->
      <div class="home__scroll-indicator">
        <div class="scroll-mouse"></div>
        <span>Desliza para ver más</span>
      </div>
    </section>

    <!-- Categorías Section -->
    <section class="home__categories">
      <div class="section-header">
        <h2 class="section-title">Nuestras Categorías</h2>
        <p class="section-subtitle">Explora nuestras colecciones especializadas</p>
      </div>
      
      <div class="home__categories-container">
        <div class="home__categories-grid">
          <div 
            class="category-card" 
            v-for="(category, index) in categoriesStore.allCategories" 
            :key="category.id"
            @click="goToCategory(category.name)"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="category-card__image-container">
              <img 
                :src="category.image || '/fotos/default.jpg'" 
                :alt="category.name" 
                class="category-card__image" 
              />
              <div class="category-card__overlay">
                <div class="category-card__icon">
                  <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
            <div class="category-card__content">
              <h3 class="category-card__title">{{ category.name }}</h3>
              <span class="category-card__cta">Ver productos</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Productos Destacados -->
    <section class="home__products">
      <div class="section-header">
        <h2 class="section-title">Productos Destacados</h2>
        <p class="section-subtitle">Una selección cuidada de nuestras mejores piezas</p>
      </div>
      
      <div class="home__products-container">
        <div class="home__products-grid">
          <ProductCard 
            v-for="(product, index) in productsStore.randomProducts" 
            :key="product.id" 
            :producto="product"
            :style="{ '--delay': index * 0.1 + 's' }"
          />
        </div>
        
        <div class="home__products-cta">
          <router-link to="/shop" class="btn-secondary">
            <span>Ver todos los productos</span>
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="home__newsletter">
      <div class="newsletter-card">
        <div class="newsletter-card__icon">
          <i class="fas fa-envelope"></i>
        </div>
        <h3 class="newsletter-card__title">¿Quieres estar al día?</h3>
        <p class="newsletter-card__subtitle">Recibe las últimas tendencias y ofertas exclusivas</p>
        <div class="newsletter-card__form">
          <div class="input-group">
            <input 
              type="email" 
              v-model="newsletterEmail"
              placeholder="tu@email.com" 
              class="newsletter-input"
              @keydown="handleNewsletterKeydown"
              :disabled="isSubscribing"
            />
            <button 
              class="newsletter-btn"
              @click="subscribeToNewsletter"
              :disabled="isSubscribing"
            >
              <i v-if="!isSubscribing" class="fas fa-paper-plane"></i>
              <i v-else class="fas fa-spinner fa-spin"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCategoriesStore } from '../stores/categoriesStore';
import { useProductsStore } from '../stores/productsStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';

const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();
const router = useRouter();
const toast = useToast();

// Estado para la newsletter
const newsletterEmail = ref('');
const isSubscribing = ref(false);

const slides = ref([
  { image: '/fotos/carrusel3.jpg', text: 'Dale vida a tu hogar con un toque único' },
  { image: '/fotos/carrusel1.jpg', text: 'Pequeños detalles con un gran impacto' },
  { image: '/fotos/carrusel4.jpg', text: 'Confort y elegancia en cada rincón' },
  { image: '/fotos/carrusel2.jpg', text: 'Transforma tu espacio en un hogar acogedor' },
  { image: '/fotos/carrusel5.jpg', text: 'Encuentra la inspiración que necesitas' },
]);

// Función para suscribirse a la newsletter usando localStorage
const subscribeToNewsletter = async () => {
  // Validar email
  if (!newsletterEmail.value || !isValidEmail(newsletterEmail.value)) {
    toast.error('Por favor, introduce un email válido');
    return;
  }

  isSubscribing.value = true;

  try {
    // Simular delay de red para mejor UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Obtener suscripciones existentes
    const existingSubscriptions = JSON.parse(localStorage.getItem('lm_newsletter_subscribers') || '[]');
    
    // Verificar si el email ya está suscrito
    const emailExists = existingSubscriptions.some(
      (subscription: any) => subscription.email.toLowerCase() === newsletterEmail.value.toLowerCase()
    );

    if (emailExists) {
      toast.warning('Este email ya está suscrito a nuestra newsletter');
      isSubscribing.value = false;
      return;
    }

    // Crear nueva suscripción
    const newSubscription = {
      email: newsletterEmail.value.toLowerCase(),
      fecha: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      origen: 'website_home_newsletter',
      activo: true
    };

    // Agregar nueva suscripción
    existingSubscriptions.push(newSubscription);
    
    // Guardar en localStorage
    localStorage.setItem('lm_newsletter_subscribers', JSON.stringify(existingSubscriptions));
    
    // Guardar estadísticas
    const stats = JSON.parse(localStorage.getItem('lm_newsletter_stats') || '{}');
    stats.totalSuscripciones = (stats.totalSuscripciones || 0) + 1;
    stats.ultimaSuscripcion = newSubscription.fecha;
    localStorage.setItem('lm_newsletter_stats', JSON.stringify(stats));

    // Opcional: Enviar evento a Google Analytics si está configurado
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_subscription', {
        event_category: 'engagement',
        event_label: 'home_page',
        value: 1
      });
    }

    // Mostrar mensaje de éxito personalizado
    toast.success('¡Te has suscrito correctamente! 🎉 Te mantendremos informado sobre nuestras últimas tendencias, ofertas exclusivas y novedades en decoración.');
    
    // Limpiar el campo
    newsletterEmail.value = '';

  } catch (error) {
    console.error('Error al procesar la suscripción:', error);
    toast.error('Error al procesar la suscripción. Por favor, inténtalo de nuevo.');
  } finally {
    isSubscribing.value = false;
  }
};

// Función para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Manejar Enter en el input
const handleNewsletterKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    subscribeToNewsletter();
  }
};

onMounted(async () => {
  await categoriesStore.fetchCategories();
  await productsStore.fetchProducts();
  console.log('Categorías cargadas:', categoriesStore.allCategories);
});

const goToCategory = (categoryName: string) => {
  router.push({ path: '/shop', query: { category: categoryName } });
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.home {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

// === HERO SECTION ===
.home__hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
}

.home__carousel {
  height: 100% !important;
  
  :deep(.v-carousel__item) {
    height: 100% !important;
  }
}

.home__slide {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home__slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 2;
}

.home__slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.home__slide-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 $spacing-lg;
  max-width: 100%;
}

.home__slide-text {
  animation: slideUp 1s ease-out;
}

.home__slide-title {
  font-size: clamp(1.8rem, 8vw, 3.5rem);
  font-weight: $font-weight-black;
  color: white;
  margin: 0 0 2rem;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  font-family: $font-family-primary;
  letter-spacing: -0.02em;
}

.home__slide-cta {
  margin-top: 2rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, $primary-color 0%, $primary-color-dark 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: $border-radius-pill;
  font-weight: $font-weight-semibold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba($primary-color, 0.3);
  text-decoration: none;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba($primary-color, 0.4);
    
    i {
      transform: translateX(4px);
    }
  }
  
  i {
    transition: transform 0.3s ease;
  }
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: $primary-color;
  border: 2px solid $primary-color;
  padding: 1rem 2rem;
  border-radius: $border-radius-pill;
  font-weight: $font-weight-semibold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  
  &:hover {
    background: $primary-color;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba($primary-color, 0.3);
    
    i {
      transform: translateX(4px);
    }
  }
  
  i {
    transition: transform 0.3s ease;
  }
}

.home__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.875rem;
  z-index: 3;
  animation: bounce 2s infinite;
  
  span {
    opacity: 0.8;
    font-weight: $font-weight-medium;
  }
}

.scroll-mouse {
  width: 20px;
  height: 32px;
  border: 2px solid white;
  border-radius: 12px;
  position: relative;
  opacity: 0.8;
  
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 6px;
    background: white;
    border-radius: 2px;
    animation: scroll 2s infinite;
  }
}

// === SECCIONES COMUNES ===
.section-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 $spacing-lg;
}

.section-title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: $font-weight-bold;
  color: $text-color;
  margin: 0 0 1rem;
  font-family: $font-family-primary;
  letter-spacing: -0.02em;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, $primary-color 0%, $primary-color-dark 100%);
    margin: 1rem auto 0;
    border-radius: 2px;
  }
}

.section-subtitle {
  font-size: 1.1rem;
  color: $text-color-secondary;
  margin: 0;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
}

// === CATEGORÍAS ===
.home__categories {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fffe 0%, #f0f8f6 100%);
}

.home__categories-container {
  padding: 0 1rem;
}

.home__categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
  max-width: 400px;
  margin: 0 auto;
}

.category-card {
  background: white;
  border-radius: $border-radius-2xl;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out both;
  animation-delay: var(--delay, 0s);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
    
    .category-card__image {
      transform: scale(1.1);
    }
    
    .category-card__overlay {
      opacity: 1;
    }
  }
}

.category-card__image-container {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.category-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba($primary-color, 0.8) 0%, rgba($primary-color-dark, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card__icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: $border-radius-circle;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  font-size: 1.5rem;
  font-weight: $font-weight-bold;
  transform: scale(0.8);
  transition: transform 0.3s ease;
  
  .category-card:hover & {
    transform: scale(1);
  }
}

.category-card__content {
  padding: $spacing-lg;
  text-align: center;
}

.category-card__title {
  font-size: 1.25rem;
  font-weight: $font-weight-bold;
  color: $text-color;
  margin: 0 0 0.5rem;
  font-family: $font-family-primary;
}

.category-card__cta {
  font-size: 0.9rem;
  color: $primary-color;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// === PRODUCTOS DESTACADOS ===
.home__products {
  padding: 4rem 0;
  background: white;
}

.home__products-container {
  padding: 0 1rem;
}

.home__products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  > * {
    animation: fadeInUp 0.6s ease-out both;
    animation-delay: var(--delay, 0s);
  }
}

.home__products-cta {
  text-align: center;
}

// === NEWSLETTER ===
.home__newsletter {
  padding: 4rem 1rem;
  background: linear-gradient(135deg, $primary-color 0%, $primary-color-dark 100%);
}

.newsletter-card {
  background: white;
  border-radius: $border-radius-2xl;
  padding: 2.5rem $spacing-lg;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

.newsletter-card__icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, $primary-color 0%, $primary-color-dark 100%);
  border-radius: $border-radius-circle;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-lg;
  color: white;
  font-size: 2rem;
}

.newsletter-card__title {
  font-size: $spacing-lg;
  font-weight: $font-weight-bold;
  color: $text-color;
  margin: 0 0 0.5rem;
  font-family: $font-family-primary;
}

.newsletter-card__subtitle {
  font-size: 1rem;
  color: $text-color-secondary;
  margin: 0 0 2rem;
  line-height: 1.5;
}

.input-group {
  display: flex;
  background: $tertiary-color;
  border-radius: $border-radius-pill;
  padding: 0.25rem;
  overflow: hidden;
}

.newsletter-input {
  flex: 1;
  border: none;
  background: none;
  padding: 1rem $spacing-lg;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: $text-color-secondary;
  }
}

.newsletter-btn {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, $primary-color 0%, $primary-color-dark 100%);
  border: none;
  border-radius: $border-radius-circle;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba($primary-color, 0.4);
  }
}

// === ANIMACIONES ===
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// === RESPONSIVE DESIGN (Tablets y Desktop) ===
@media (min-width: $breakpoint-sm) {
  .home__slide-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
  }
  
  .home__categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1200px;
  }
  
  .home__products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-xl;
    max-width: 1400px;
    justify-items: center;
  }
  
  .newsletter-card {
    padding: 3rem 2rem;
    max-width: 500px;
  }
  
  // Newsletter más ligero en desktop con transparencia
  .home__newsletter {
    background: linear-gradient(135deg, 
      rgba($primary-color, 0.85) 0%, 
      rgba($primary-color-dark, 0.9) 100%
    );
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      pointer-events: none;
    }
  }
}

@media (min-width: $breakpoint-lg) {
  .section-header {
    margin-bottom: 4rem;
  }
  
  .home__categories,
  .home__products {
    padding: 5rem 0;
  }
  
  .home__newsletter {
    padding: 5rem 2rem;
  }
  
  // Productos aún más grandes en pantallas grandes
  .home__products-grid {
    gap: 2.5rem;
    max-width: 1600px;
  }
  
  // Newsletter con patrón sutil y más transparencia en pantallas grandes
  .home__newsletter {
    background: linear-gradient(135deg, 
      rgba($primary-color, 0.75) 0%, 
      rgba($primary-color-dark, 0.8) 100%
    );
  }
}
</style>