<!-- @/components/admin/AdminFormGroup.vue -->
<template>
  <div class="admin-form-group">
    <label v-if="label" class="admin-form-group__label">
      {{ label }}
      <span v-if="required" class="admin-form-group__required">*</span>
    </label>
    
    <div class="admin-form-group__content">
      <slot></slot>
    </div>
    
    <div v-if="error" class="admin-form-group__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-form-group {
  margin-bottom: $spacing-md;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &__label {
    display: block;
    font-weight: $font-weight-medium;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }
  
  &__required {
    color: $error-color;
    margin-left: 2px;
  }
  
  &__content {
    width: 100%;
  }
  
  &__error {
    font-size: $font-size-small;
    color: $error-color;
    margin-top: $spacing-xs;
  }
}
</style>