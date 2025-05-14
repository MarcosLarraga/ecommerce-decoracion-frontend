<!-- @/components/admin/AdminModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="admin-modal" @click.self="close">
      <div 
        class="admin-modal__content"
        :class="`admin-modal__content--${size}`"
      >
        <div class="admin-modal__header">
          <h3 class="admin-modal__title">{{ title }}</h3>
          <button
            class="admin-modal__close"
            @click="close"
            type="button"
            aria-label="Cerrar"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="admin-modal__body">
          <slot></slot>
        </div>
        
        <div v-if="$slots.footer" class="admin-modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  }
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};

// Close on escape key
watch(() => props.modelValue, (value) => {
  if (value) {
    document.addEventListener('keydown', handleEscKey);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleEscKey);
    document.body.style.overflow = '';
  }
});

const handleEscKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close();
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-modal;
  padding: $spacing-md;
  
  &__content {
    background-color: white;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow-lg;
    width: 100%;
    max-height: calc(100vh - #{$spacing-md * 2});
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modal-fade-in 0.3s ease;
    
    &--sm {
      max-width: 400px;
    }
    
    &--md {
      max-width: 600px;
    }
    
    &--lg {
      max-width: 800px;
    }
    
    &--xl {
      max-width: 1000px;
    }
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color;
  }
  
  &__title {
    margin: 0;
    font-size: $font-size-large;
    font-weight: $font-weight-semibold;
    color: $text-color;
  }
  
  &__close {
    background: none;
    border: none;
    color: $text-color-secondary;
    font-size: $font-size-large;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    
    &:hover {
      background-color: rgba($tertiary-color, 0.5);
      color: $text-color;
    }
  }
  
  &__body {
    padding: $spacing-lg;
    overflow-y: auto;
    flex: 1;
  }
  
  &__footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color;
    display: flex;
    justify-content: flex-end;
    gap: $spacing-md;
  }
  
  &__warning {
    background-color: rgba($warning-color, 0.1);
    border-left: 4px solid $warning-color;
    padding: $spacing-md;
    margin: $spacing-md 0;
    border-radius: $border-radius-sm;
    
    i {
      color: $warning-color;
      margin-right: $spacing-sm;
    }
  }
  
  &__message {
    margin-bottom: $spacing-md;
    line-height: 1.5;
  }
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>