<script setup>
import { ref } from 'vue';
import PageHero from '@/components/PageHero.vue';
import Footer from '@/components/Footer.vue';
import SoporteInfo from '@/components/SoporteInfo.vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitForm = () => {
  console.log("Formulario enviado:", form.value);
  alert("Mensaje enviado con éxito.");
};
</script>

<template>
  <v-container fluid class="page-container">
    <!-- Hero Section -->
    <PageHero title="Contacto" imageSrc="/fotos/PageHero.jpg" />

    <v-container class="contact-container">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <h2 class="contact-title">Contacto con nosotros</h2>
          <p class="contact-text">
            Para obtener más información sobre nuestros productos y servicios, no dudes en enviarnos un correo electrónico.
            Nuestro equipo siempre estará disponible para ayudarte.
          </p>

          <!-- Contact Form -->
          <v-form ref="form">
            <v-text-field label="Tu nombre" v-model="form.name" required></v-text-field>
            <v-text-field label="Correo electrónico" v-model="form.email" type="email" required></v-text-field>
            <v-text-field label="Asunto (opcional)" v-model="form.subject"></v-text-field>
            <v-textarea label="Mensaje" v-model="form.message" required></v-textarea>

            <v-btn color="primary" block class="contact-btn" @click="submitForm">
              Enviar
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>

    <!-- Sección de soporte reutilizada -->
    <SoporteInfo />

    <!-- Footer -->
    <Footer class="footer" />
  </v-container>
</template>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 64px; /* Evita que el navbar tape contenido */
}

.contact-container {
  flex-grow: 1;
  text-align: center;
  padding: 40px 0;
}

.contact-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.contact-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
}

.contact-btn {
  margin-top: 15px;
  background-color: #c99a2e; /* Color del botón */
  color: white;
  font-weight: bold;
}

.footer {
  margin-top: auto; /* Asegura que el footer se mantenga en la parte inferior */
}
</style>
