<template>
  <div class="product-detail">
    <div class="product-detail__container">
      <div class="product-detail__image-wrapper">
        <img :src="product?.urlImagen" :alt="product?.nombre" class="product-detail__image" />
      </div>

      <div class="product-detail__info">
        <h1 class="product-detail__title">{{ product?.nombre }}</h1>
        <p class="product-detail__price">{{ product?.precio }} €</p>
        <p class="product-detail__description">{{ product?.descripcion }}</p>

        <!-- 🔹 Mostrar promedio de calificación -->
        <div v-if="reseñaStore.promedioCalificacion > 0" class="product-detail__rating">
          Media de calificación:
          <span class="stars">
            <span v-for="star in 5" :key="star" class="star">
              {{ star <= reseñaStore.promedioCalificacion ? '⭐' : '☆' }}
            </span>
          </span>
          ({{ reseñaStore.promedioCalificacion.toFixed(1) }}/5)
        </div>

        <button class="product-detail__cart-btn" @click="addToCart">Añadir al Carrito</button>
      </div>
    </div>

    <!-- 🔹 SECCIÓN DE RESEÑAS -->
    <div class="product-reviews">
      <h2 class="product-reviews__title">Reseñas</h2>

      <div v-if="reseñaStore.reseñas.length > 0" class="product-reviews__list">
        <div v-for="reseña in reseñaStore.reseñas" :key="reseña.id" class="review">
          <p>
            <strong>{{ reseña.usuario?.nombre || 'Usuario Anónimo' }}</strong>
            - ⭐ {{ reseña.calificacion }}/5
          </p>
          <p>{{ reseña.comentario }}</p>

          <!-- 🔹 Botón de eliminación para admins o dueños de la reseña -->
          <button v-if="userStore.user?.esAdmin || reseña.usuarioId === userStore.user?.id"
            @click="eliminarReseña(reseña.id)"
            class="delete-review-btn"
          >
            ❌ Eliminar
          </button>
        </div>
      </div>
      <div v-else class="product-reviews__empty">
        <p>No hay reseñas aún. ¡Sé el primero en escribir una!</p>
      </div>

      <!-- 🔹 FORMULARIO PARA AGREGAR UNA RESEÑA -->
      <div v-if="userStore.isAuthenticated" class="product-reviews__form">
        <h3>Deja tu reseña</h3>
        <textarea v-model="comentario" placeholder="Escribe tu comentario..." required></textarea>
        <select v-model="calificacion" required>
          <option value="" disabled>Selecciona una calificación</option>
          <option v-for="num in 5" :key="num" :value="num">{{ num }} ⭐</option>
        </select>
        <button @click="submitReview" class="product-reviews__submit">Enviar Reseña</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '@/stores/cartStore';
import { useReseñaStore } from '@/stores/reseñaStore';
import { useUserStore } from '@/stores/userStore';

const route = useRoute();
const cartStore = useCartStore();
const reseñaStore = useReseñaStore();
const userStore = useUserStore();

const product = ref(null);
const comentario = ref('');
const calificacion = ref<number | null>(null);

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:5162/api/Producto/${route.params.id}`);
    product.value = response.data;

    await reseñaStore.fetchReseñasByProductoId(product.value.id);
    await reseñaStore.fetchPromedioCalificacion(product.value.id);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
  }
});

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.nombre,
      price: product.value.precio,
      image: product.value.urlImagen,
    });
  }
};

const submitReview = async () => {
  if (!comentario.value || !calificacion.value) {
    alert("Debe completar el comentario y la calificación.");
    return;
  }

  await reseñaStore.agregarReseña(product.value.id, userStore.user.id, comentario.value, calificacion.value);
  comentario.value = '';
  calificacion.value = null;
};

const eliminarReseña = async (reseñaId: number) => {
  await reseñaStore.eliminarReseña(reseñaId);
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-detail {
  width: 100%;
  max-width: 1000px;
  margin: 80px auto;
  padding: $spacing-md;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: $spacing-lg;
  }

  &__image-wrapper {
    width: 100%;
    max-width: 400px;
  }

  &__image {
    width: 100%;
    border-radius: $border-radius;
    object-fit: cover;
  }

  &__info {
    width: 100%;
    max-width: 500px;
    text-align: center;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }

  &__price {
    font-size: 1.5rem;
    color: $primary-color;
  }

  &__description {
    font-size: 1.1rem;
    margin-top: $spacing-md;
    margin-bottom: $spacing-md;
  }

  &__cart-btn {
    background-color: $primary-color;
    color: white;
    padding: $spacing-sm $spacing-md;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    border-radius: $border-radius;
    transition: background-color 0.3s ease;

    &:hover {
      opacity: 0.85;
    }
  }
}

/* 🔹 Sección de Reseñas */
.product-reviews {
  margin-top: 40px;
  padding: $spacing-md;
  background: #f8f8f8;
  border-radius: $border-radius;

  &__title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: $spacing-md;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  .review {
    padding: $spacing-sm;
    border-bottom: 1px solid $color-borde;
  }

  &__empty {
    text-align: center;
    font-style: italic;
  }

  &__form {
    margin-top: $spacing-lg;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    textarea {
      width: 100%;
      padding: $spacing-sm;
      border: 1px solid $color-borde;
      border-radius: $border-radius;
      font-size: 1rem;
    }

    select {
      padding: $spacing-sm;
      border-radius: $border-radius;
      font-size: 1rem;
    }
  }

  &__submit {
    background-color: $primary-color;
    color: white;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;

    &:hover {
      opacity: 0.85;
    }
  }

  &__login {
    text-align: center;
    font-style: italic;
    color: $secondary-color;
  }
}

@media (min-width: 768px) {
  .product-detail {
    &__container {
      flex-direction: row;
      align-items: flex-start;
      text-align: left;
    }

    &__info {
      text-align: left;
    }
  }
}
</style>
