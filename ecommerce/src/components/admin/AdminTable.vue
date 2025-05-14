<!-- @/components/admin/AdminTable.vue -->
<template>
  <div class="admin-table-wrapper">
    <div v-if="loading" class="admin-table__loading">
      <div class="admin-table__spinner"></div>
      <p>Cargando datos...</p>
    </div>
    
    <div v-else-if="isEmpty" class="admin-table__empty">
      <i class="fas fa-inbox"></i>
      <p>{{ emptyMessage }}</p>
    </div>
    
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.class">{{ column.label }}</th>
          <th v-if="$slots.default" class="admin-table__actions-col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps({
  columns: {
    type: Array as () => Array<{ label: string, key: string, class?: string }>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isEmpty: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No hay datos disponibles'
  }
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.admin-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  th, td {
    padding: $spacing-md;
    text-align: left;
    border-bottom: 1px solid $border-color;
  }
  
  th {
    font-weight: $font-weight-semibold;
    color: $text-color;
    background-color: rgba($primary-color, 0.05);
    white-space: nowrap;
  }
  
  td {
    color: $text-color-secondary;
    vertical-align: middle;
  }
  
  tbody tr {
    transition: background-color $transition-fast;
    
    &:hover {
      background-color: rgba($tertiary-color, 0.3);
    }
  }
  
  &__actions-col {
    width: 120px;
    text-align: right;
  }
  
  td:last-child {
    text-align: right;
    padding-right: $spacing-lg;
    // Importante: esto soluciona el problema de alineación de botones
    white-space: nowrap;
    
    .admin-button {
      display: inline-flex;
      margin: 0 2px;
    }
  }
  
  &__loading, &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl;
    color: $text-color-secondary;
    text-align: center;
    background-color: white;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }
  
  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba($primary-color, 0.3);
    border-radius: 50%;
    border-top-color: $primary-color;
    animation: spin 1s linear infinite;
    margin-bottom: $spacing-md;
  }
  
  &__empty {
    i {
      font-size: $font-size-xxl;
      opacity: 0.3;
      margin-bottom: $spacing-md;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>