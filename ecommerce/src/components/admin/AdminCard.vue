<!-- @/components/admin/AdminCard.vue -->
<template>
  <div class="admin-card" :class="`admin-card--${type}`">
    <div v-if="icon" class="admin-card__icon">
      <i :class="icon"></i>
    </div>
    <div class="admin-card__content">
      <h3 class="admin-card__title">{{ title }}</h3>
      <p class="admin-card__value"><slot></slot></p>
    </div>
    <router-link v-if="linkTo" :to="linkTo" class="admin-card__link">
      {{ linkText }} <i class="fas fa-arrow-right"></i>
    </router-link>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'success', 'warning', 'info'].includes(value)
  },
  linkTo: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: 'Ver detalles'
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-card {
  background-color: white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  box-shadow: $box-shadow;
  transition: transform $transition-fast, box-shadow $transition-fast;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $box-shadow-lg;
  }
  
  &__icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }
  
  &__content {
    flex: 1;
  }
  
  &__title {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $text-color-secondary;
    margin-top: 0;
    margin-bottom: $spacing-xs;
  }
  
  &__value {
    font-size: $font-size-xxl;
    font-weight: $font-weight-bold;
    margin: 0;
  }
  
  &__link {
    margin-top: $spacing-md;
    display: inline-flex;
    align-items: center;
    color: inherit;
    text-decoration: none;
    font-weight: $font-weight-medium;
    
    i {
      margin-left: $spacing-xs;
      transition: transform $transition-fast;
    }
    
    &:hover i {
      transform: translateX(3px);
    }
  }
  
  // Variantes
  &--primary {
    .admin-card__icon {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
    }
    .admin-card__link {
      color: $primary-color;
    }
  }
  
  &--success {
    .admin-card__icon {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }
    .admin-card__link {
      color: $success-color;
    }
  }
  
  &--warning {
    .admin-card__icon {
      background-color: rgba($warning-color, 0.1);
      color: $warning-color;
    }
    .admin-card__link {
      color: $warning-color;
    }
  }
  
  &--info {
    .admin-card__icon {
      background-color: rgba($info-color, 0.1);
      color: $info-color;
    }
    .admin-card__link {
      color: $info-color;
    }
  }
}
</style>