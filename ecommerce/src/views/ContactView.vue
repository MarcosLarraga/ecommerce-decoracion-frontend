<script setup>
import { ref } from 'vue';
import PageHero from '@/components/PageHero.vue';
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
    <PageHero title="Contacto" imageSrc="/fotos/PageHero.jpg" />

    <v-container class="contact-container">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="6">
          <h2 class="contact-title">Contacto con nosotros</h2>
          <p class="contact-text">
            Para obtener más información sobre nuestros productos y servicios, no dudes en enviarnos un correo electrónico.
            Nuestro equipo siempre estará disponible para ayudarte.
          </p>

          <v-form ref="form">
            <v-text-field label="Tu nombre" v-model="form.name" required></v-text-field>
            <v-text-field label="Correo electrónico" v-model="form.email" type="email" required></v-text-field>
            <v-text-field label="Asunto (opcional)" v-model="form.subject"></v-text-field>
            <v-textarea label="Mensaje" v-model="form.message" required></v-textarea>

            <div class="button-container">
              <v-btn class="contact-btn" @click="submitForm">
                Enviar
              </v-btn>
            </div>
          </v-form>
        </v-col>
      </v-row>
    </v-container>

    <SoporteInfo />
  </v-container>
</template>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
}

.contact-container {
  flex-grow: 1;
  text-align: center;
  padding: 20px;
}

.v-container {
  padding: 0px !important;
  margin: 0px !important;
  width: 100vw !important;
  max-width: 100vw !important;
}

.contact-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 30px;
}

.contact-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 20px;
  padding: 0 10px;
}

.button-container {
  display: flex;
  justify-content: center;
}

.contact-btn {
  margin-top: 15px;
  margin-bottom: 50px;
  background-color: #007a3d !important;
  color: white !important;
  font-weight: bold;
  text-transform: uppercase;
  width: 120px !important;
  height: 40px !important;
  min-width: 120px !important;
  max-width: 120px !important;
}

@media (min-width: 768px) {
  .contact-title {
    font-size: 1.8rem;
  }

  .contact-text {
    font-size: 1.2rem;
  }

  .contact-btn {
    width: 150px !important;
    min-width: 150px !important;
    max-width: 150px !important;
  }
}

@media (min-width: 1024px) {
  .contact-title {
    font-size: 2rem;
  }

  .contact-text {
    font-size: 1.3rem;
  }

  .contact-btn {
    width: 180px !important;
    min-width: 180px !important;
    max-width: 180px !important;
  }
}
</style>