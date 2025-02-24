<script setup>
import PageHero from '@/components/PageHero.vue';

const secciones = [
  {
    titulo: "Textil",
    descripcion:
      "Los textiles transforman los espacios aportando calidez y personalidad. Combina cojines, mantas y alfombras para crear ambientes acogedores. Opta por colores neutros para armonía o estampados llamativos para un toque vibrante. Mezclar texturas como lino, terciopelo o lana añade profundidad y estilo.",
    imagen: "/fotos/Textil_resized.jpg",
  },
  {
    titulo: "Decoración vertical",
    descripcion:
      "Aprovecha las paredes para agregar carácter a tu hogar. Cuadros, espejos, estanterías flotantes o paneles de madera pueden transformar un espacio vacío en un punto focal. Para un efecto equilibrado, juega con diferentes tamaños y composiciones. La iluminación estratégica resaltará cada elemento.",
    imagen: "/fotos/Decoracion_Vertical_resized.jpg",
  },
  {
    titulo: "Accesorio decorativo",
    descripcion:
      "Los accesorios son clave para dar un toque final a la decoración. Jarrones, velas, esculturas y elementos naturales como plantas añaden personalidad sin recargar el ambiente. Opta por materiales como cerámica, vidrio o metal para lograr una combinación sofisticada y armoniosa.",
    imagen: "/fotos/AccesorioDecorativo_resized.jpg",
  },
];
</script>

<template>
  <v-container fluid class="pa-0">
    <PageHero title="Guía de Decoración" imageSrc="/fotos/PageHero.jpg" />

    <v-container class="guia__container">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <div v-for="(item, index) in secciones" :key="index" class="guia__seccion">
            <v-img :src="item.imagen" :alt="item.titulo" class="guia__imagen" contain />
            <h2 class="guia__titulo">{{ item.titulo }}</h2>
            <p class="guia__descripcion">{{ item.descripcion }}</p>
            <div v-if="index !== secciones.length - 1" class="guia__linea"></div> 
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped lang="scss">
.guia__container {
  padding: 40px 20px;
}

.guia__seccion {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 40px;
}

.guia__imagen {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); 
}

.guia__titulo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.guia__descripcion {
  font-size: 1.1rem;
  color: #666;
  max-width: 700px;
}

.guia__linea {
  width: 50%;
  height: 2px;
  background-color: #ddd;
  margin-top: 30px;
}
</style>
