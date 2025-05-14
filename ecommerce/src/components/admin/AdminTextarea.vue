<!-- @/components/admin/AdminTextarea.vue -->
<template>
  <textarea
    class="admin-textarea"
    :class="{ 'admin-textarea--error': error }"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :required="required"
  ></textarea>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  rows: {
    type: [String, Number],
    default: 3
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

defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-textarea {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  background-color: white;
  font-size: $font-size-base;
  color: $text-color;
  resize: vertical;
  transition: border-color $transition-fast, box-shadow $transition-fast;
  min-height: 40px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }
  
  &::placeholder {
    color: $text-color-tertiary;
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
</style>