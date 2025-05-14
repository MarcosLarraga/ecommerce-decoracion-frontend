<!-- @/components/admin/AdminFilter.vue -->
<template>
  <div class="admin-filter">
    <label v-if="label" class="admin-filter__label">{{ label }}</label>
    <div class="admin-filter__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-filter {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  
  &__label {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-medium;
  }
  
  &__content {
    flex: 1;
  }
}
</style>