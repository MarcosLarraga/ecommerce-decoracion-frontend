<!-- @/components/admin/AdminContent.vue -->
<template>
  <div class="admin-content">
    <div v-if="$slots.filters" class="admin-content__filters">
      <slot name="filters"></slot>
    </div>
    
    <div class="admin-content__main">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// No requiere props
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-content {
  background-color: white;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow;
  overflow: hidden;
  
  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    padding: $spacing-md;
    background-color: rgba($tertiary-color, 0.5);
    border-bottom: 1px solid $border-color;
  }
  
  &__main {
    padding: $spacing-md;
  }
}
</style>