<!-- @/components/admin/AdminSearch.vue -->
<template>
  <div class="admin-search">
    <div class="admin-search__icon">
      <i class="fas fa-search"></i>
    </div>
    <input
      type="text"
      class="admin-search__input"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
    />
    <button 
      v-if="modelValue" 
      class="admin-search__clear" 
      type="button"
      @click="$emit('update:modelValue', '')"
      title="Limpiar búsqueda"
    >
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-search {
  position: relative;
  width: 100%;
  max-width: 300px;
  
  &__icon {
    position: absolute;
    left: $spacing-sm;
    top: 50%;
    transform: translateY(-50%);
    color: $text-color-secondary;
    font-size: $font-size-base;
  }
  
  &__input {
    width: 100%;
    height: 40px;
    padding: $spacing-sm $spacing-xl $spacing-sm $spacing-xl;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background-color: white;
    font-size: $font-size-base;
    color: $text-color;
    
    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }
    
    &::placeholder {
      color: $text-color-tertiary;
    }
  }
  
  &__clear {
    position: absolute;
    right: $spacing-sm;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: $text-color-secondary;
    font-size: $font-size-base;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    
    &:hover {
      color: $text-color;
    }
  }
}
</style>