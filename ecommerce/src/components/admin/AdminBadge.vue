<!-- @/components/admin/AdminBadge.vue -->
<template>
  <span 
    class="admin-badge"
    :class="[
      `admin-badge--${type}`,
      { 'admin-badge--rounded': rounded }
    ]"
  >
    <i v-if="icon" :class="icon" class="admin-badge__icon"></i>
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'admin', 'user', 'primary', 'success', 'error', 'warning', 'info'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  white-space: nowrap;
  
  &--rounded {
    border-radius: 30px;
  }
  
  &__icon {
    margin-right: 4px;
  }
  
  &--default {
    background-color: $tertiary-color;
    color: $text-color;
  }
  
  &--admin {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &--user {
    background-color: rgba($info-color, 0.1);
    color: $info-color;
  }
  
  &--primary {
    background-color: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &--success {
    background-color: rgba($success-color, 0.1);
    color: $success-color;
  }
  
  &--error {
    background-color: rgba($error-color, 0.1);
    color: $error-color;
  }
  
  &--warning {
    background-color: rgba($warning-color, 0.1);
    color: $warning-color;
  }
  
  &--info {
    background-color: rgba($info-color, 0.1);
    color: $info-color;
  }
}
</style>