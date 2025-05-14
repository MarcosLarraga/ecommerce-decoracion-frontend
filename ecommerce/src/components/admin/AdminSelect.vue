<!-- @/components/admin/AdminSelect.vue -->
<template>
  <div class="admin-select-container">
    <select
      class="admin-select"
      :class="{ 'admin-select--error': error }"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      @change="$emit('change', $event)"
      :disabled="disabled"
      :required="required"
    >
      <slot></slot>
    </select>
    <div class="admin-select__icon">
      <i class="fas fa-chevron-down"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  error: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'change']);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-select-container {
  position: relative;
  width: 100%;
}

.admin-select {
  width: 100%;
  height: 40px;
  padding: $spacing-sm $spacing-xl $spacing-sm $spacing-sm;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: white;
  font-size: $font-size-base;
  color: $text-color;
  appearance: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }
  
  &:disabled {
    background-color: $tertiary-color;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  &--error {
    border-color: $error-color;
    
    &:focus {
      border-color: $error-color;
      box-shadow: 0 0 0 2px rgba($error-color, 0.2);
    }
  }
}

.admin-select__icon {
  position: absolute;
  right: $spacing-sm;
  top: 50%;
  transform: translateY(-50%);
  color: $text-color-secondary;
  pointer-events: none;
  font-size: $font-size-small;
}
</style>