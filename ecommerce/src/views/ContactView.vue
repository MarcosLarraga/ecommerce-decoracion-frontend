<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { useToast } from 'vue-toastification';
import PageHero from '../components/PageHero.vue';
import SoporteInfo from '../components/SoporteInfo.vue';

const toast = useToast();

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const rules = {
  name: { required, minLength: minLength(3) },
  email: { required, email },
  subject: { minLength: minLength(3) },
  message: { required, minLength: minLength(10) },
};

const v$ = useVuelidate(rules, form);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    console.log("Formulario enviado:", form.value);
    toast.success("Mensaje enviado con éxito.");
    v$.value.$reset();
    form.value = { name: '', email: '', subject: '', message: '' };
  } else {
    toast.error("Por favor, corrija los errores en el formulario.");
  }
};

// Información de contacto
const contactInfo = ref([
  {
    icon: "fas fa-envelope",
    title: "Email",
    description: "info@lmdecoraciones.com",
    highlight: "Respuesta en 24h"
  },
  {
    icon: "fas fa-phone",
    title: "Teléfono",
    description: "+34 123 456 789",
    highlight: "Lun - Vie 9:00-18:00"
  },
  {
    icon: "fas fa-map-marker-alt",
    title: "Ubicación",
    description: "Zaragoza, España",
    highlight: "Visítanos"
  },
  {
    icon: "fas fa-clock",
    title: "Horario",
    description: "9:00 - 18:00 h",
    highlight: "Lunes a Viernes"
  }
]);
</script>

<template>
  <div class="contact">
    <PageHero title="Contacto" imageSrc="/fotos/PageHero.jpg" />

    <!-- Introducción -->
    <div class="contact__intro">
      <div class="contact__intro-content">
        <h2 class="contact__intro-title">¿Necesitas contactar con nosotros?</h2>
        <p class="contact__intro-text">
          Estamos aquí para ayudarte. Envíanos un mensaje y nuestro equipo te responderá lo antes posible.
        </p>
      </div>
    </div>

    <div class="contact__content">
      <!-- Formulario de contacto -->
      <div class="contact__section">
        <div class="section-wrapper">
          <div class="section-header">
            <div class="section-icon">
              <i class="fas fa-paper-plane"></i>
            </div>
            <h2 class="contact__title">Envíanos un Mensaje</h2>
            <div class="section-highlight">Respuesta garantizada en 24h</div>
          </div>
          
          <div class="section-content">
            <p class="contact__text">
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
            
            <form @submit.prevent="submitForm" class="contact__form">
              <div class="form-row">
                <div class="contact__form-group">
                  <label for="name" class="form-label">
                    <i class="fas fa-user"></i>
                    Nombre
                  </label>
                  <input 
                    id="name" 
                    v-model="form.name" 
                    type="text" 
                    class="form-input"
                    :class="{ 'is-invalid': v$.name.$error }"
                    placeholder="Tu nombre completo"
                  >
                  <div v-if="v$.name.$error" class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    El nombre es requerido y debe tener al menos 3 caracteres.
                  </div>
                </div>

                <div class="contact__form-group">
                  <label for="email" class="form-label">
                    <i class="fas fa-envelope"></i>
                    Correo electrónico
                  </label>
                  <input 
                    id="email" 
                    v-model="form.email" 
                    type="email" 
                    class="form-input"
                    :class="{ 'is-invalid': v$.email.$error }"
                    placeholder="tu@email.com"
                  >
                  <div v-if="v$.email.$error" class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Por favor, introduce un correo electrónico válido.
                  </div>
                </div>
              </div>

              <div class="contact__form-group">
                <label for="subject" class="form-label">
                  <i class="fas fa-tag"></i>
                  Asunto (opcional)
                </label>
                <input 
                  id="subject" 
                  v-model="form.subject" 
                  type="text" 
                  class="form-input"
                  :class="{ 'is-invalid': v$.subject.$error }"
                  placeholder="¿Sobre qué quieres hablarnos?"
                >
                <div v-if="v$.subject.$error" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  El asunto debe tener al menos 3 caracteres.
                </div>
              </div>

              <div class="contact__form-group">
                <label for="message" class="form-label">
                  <i class="fas fa-comment-alt"></i>
                  Mensaje
                </label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  class="form-textarea"
                  :class="{ 'is-invalid': v$.message.$error }"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                ></textarea>
                <div v-if="v$.message.$error" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  El mensaje es requerido y debe tener al menos 10 caracteres.
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="contact__btn">
                  <i class="fas fa-paper-plane"></i>
                  Enviar Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Información de contacto -->
      <div class="contact__section">
        <div class="section-wrapper">
          <div class="section-header">
            <div class="section-icon">
              <i class="fas fa-address-book"></i>
            </div>
            <h2 class="contact__title">Información de Contacto</h2>
            <div class="section-highlight">Múltiples formas de contactar</div>
          </div>
          
          <div class="section-content">
            <p class="contact__text">
              Elige la forma de contacto que más te convenga. Estamos disponibles por múltiples canales.
            </p>
            
            <div class="contact-info-grid">
              <div v-for="info in contactInfo" :key="info.title" class="contact-info-card">
                <div class="contact-info-card__icon">
                  <i :class="info.icon"></i>
                </div>
                <h4 class="contact-info-card__title">{{ info.title }}</h4>
                <p class="contact-info-card__description">{{ info.description }}</p>
                <span class="contact-info-card__highlight">{{ info.highlight }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SoporteInfo />
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.contact {
  .contact__intro {
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

  // Grid de información de contacto
  .contact-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-sm;
    margin-top: $spacing-md;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-md;
      max-width: none;
    }
  }

  .contact-info-card {
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
      margin: 0 0 $spacing-xs;
      line-height: 1.2;
    }

    &__highlight {
      font-size: 8px;
      color: $primary-color;
      font-weight: $font-weight-semibold;
      text-transform: uppercase;
      letter-spacing: 0.3px;
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
        margin-bottom: $spacing-sm;
      }

      &__highlight {
        font-size: 10px;
      }
    }
  }

  // Formulario
  &__form {
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
  }

  .form-row {
    display: grid;
    gap: $spacing-md;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__form-group {
    margin-bottom: $spacing-md;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;
    color: $text-color;
    font-weight: $font-weight-semibold;
    font-size: $font-size-small;

    i {
      color: $primary-color;
      font-size: 12px;
    }
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 2px solid rgba($border-color, 0.3);
    border-radius: $border-radius;
    font-size: $font-size-base;
    font-family: inherit;
    transition: all 0.3s ease;
    background: white;
    color: $text-color;

    &::placeholder {
      color: $text-color-secondary;
      opacity: 0.7;
    }

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba($primary-color, 0.1);
    }

    &:hover {
      border-color: rgba($primary-color, 0.5);
    }

    &.is-invalid {
      border-color: #dc3545;
      box-shadow: 0 0 0 3px rgba(#dc3545, 0.1);
    }
  }

  .form-textarea {
    min-height: 120px;
    resize: vertical;
    font-family: inherit;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: #dc3545;
    font-size: $font-size-small;
    margin-top: $spacing-xs;
    font-weight: $font-weight-medium;

    i {
      font-size: 12px;
    }
  }

  .form-actions {
    text-align: center;
    margin-top: $spacing-lg;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
    color: white;
    border: none;
    border-radius: $border-radius;
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba($primary-color, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba($primary-color, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 14px;
    }
  }
}
</style>