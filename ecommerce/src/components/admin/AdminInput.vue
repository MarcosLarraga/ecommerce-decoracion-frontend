<!-- @/components/admin/AdminInput.vue -->
<template>
  <input
    :type="type"
    class="admin-input"
    :class="{ 'admin-input--error': error }"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :min="min"
    :max="max"
    :step="step"
  />
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
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
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  max: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  }
});

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-input {
  width: 100%;
  height: 40px;
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: white;
  font-size: $font-size-base;
  color: $text-color;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
  }
  
  &::placeholder {
    color: $placeholder-color;
  }
  
  &:disabled {
    background-color: $disabled-bg;
    color: $disabled-text;
    cursor: not-allowed;
  }
  
  &--error {
    border-color: $error-color;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba($error-color, 0.2);
    }
  }
}
</style>