<!-- @/components/admin/AdminHeader.vue -->
<template>
  <div class="admin-header">
    <div class="admin-header__title-container">
      <h1 class="admin-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="admin-header__subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="admin-header__actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
  gap: $spacing-md;
  
  &__title-container {
    flex: 1;
    min-width: 200px;
  }
  
  &__title {
    font-size: $font-size-xxl;
    font-weight: $font-weight-bold;
    margin: 0;
    color: $text-color;
  }
  
  &__subtitle {
    font-size: $font-size-base;
    color: $text-color-secondary;
    margin: $spacing-xs 0 0 0;
  }
  
  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex-wrap: wrap;
  }
}
</style>