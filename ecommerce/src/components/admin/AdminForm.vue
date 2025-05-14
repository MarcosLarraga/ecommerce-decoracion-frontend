<!-- @/components/admin/AdminForm.vue -->
<template>
  <form class="admin-form" @submit.prevent="$emit('submit')">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
defineEmits(['submit']);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-form {
  width: 100%;
  
  &__row {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
  }
  
  &__col {
    flex: 1;
    min-width: 250px;
    
    &--full {
      width: 100%;
      flex-basis: 100%;
    }
  }
  
  &__radio-group {
    display: flex;
    gap: $spacing-md;
  }
  
  &__radio {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input[type="radio"] {
      margin-right: $spacing-xs;
    }
  }
}
</style>