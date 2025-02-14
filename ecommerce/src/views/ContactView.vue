<template>
    <v-container fluid>
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
  
      <!-- Benefits Section -->
      <v-container class="benefits-container">
        <v-row justify="center">
          <v-col cols="12" sm="3" v-for="(benefit, index) in benefits" :key="index" class="benefit">
            <v-icon class="benefit-icon">{{ benefit.icon }}</v-icon>
            <h3 class="benefit-title">{{ benefit.title }}</h3>
            <p class="benefit-text">{{ benefit.text }}</p>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Footer -->
      <Footer />
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import PageHero from '@/components/PageHero.vue';
  import Footer from '@/components/Footer.vue';
  
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
  
  const benefits = [
    { icon: 'mdi-trophy', title: 'Alta Calidad', text: 'Fabricado con los mejores materiales' },
    { icon: 'mdi-shield-check', title: 'Garantía de Protección', text: 'Más de 2 años de garantía' },
    { icon: 'mdi-truck-fast', title: 'Envío Gratis', text: 'Pedidos superiores a 150€' },
    { icon: 'mdi-headset', title: 'Atención 24/7', text: 'Soporte dedicado' },
  ];
  </script>
  
  <style lang="scss" scoped>
  .contact-container {
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
  
  .benefits-container {
    background-color: #f5f5f5;
    padding: 40px 0;
    text-align: center;
  }
  
  .benefit {
    text-align: center;
  }
  
  .benefit-icon {
    font-size: 2.5rem;
    color: #c99a2e;
  }
  
  .benefit-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 10px;
  }
  
  .benefit-text {
    font-size: 0.9rem;
    color: #666;
  }
  </style>
  