<template>
  <div class="data-list" :class="listClass">
    <!-- List Header -->
    <div v-if="title || $slots.header" class="data-list-header">
      <h3 v-if="title" class="data-list-title">{{ title }}</h3>
      <div v-if="$slots.header" class="data-list-header-actions">
        <slot name="header" />
      </div>
    </div>

    <!-- List Content -->
    <div class="data-list-content">
      <div v-if="loading" class="data-list-loading">
        <v-skeleton-loader
          v-for="i in loadingItems"
          :key="i"
          type="list-item-two-line"
          class="mb-2"
        />
      </div>

      <div v-else-if="items && items.length === 0" class="data-list-empty">
        <slot name="empty">
          <div class="empty-state">
            <v-icon size="48" color="grey-lighten-1">mdi-inbox-outline</v-icon>
            <p class="empty-text">{{ emptyText }}</p>
          </div>
        </slot>
      </div>

      <div v-else class="data-list-items">
        <slot :items="items" />
      </div>
    </div>

    <!-- List Footer -->
    <div v-if="$slots.footer" class="data-list-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  items?: any[]
  loading?: boolean
  loadingItems?: number
  emptyText?: string
  variant?: 'default' | 'dense' | 'comfortable'
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingItems: 3,
  emptyText: 'No items found',
  variant: 'default',
  bordered: false
})

const listClass = computed(() => ({
  'data-list': true,
  [`data-list--${props.variant}`]: true,
  'data-list--bordered': props.bordered
}))
</script>

<style scoped>
.data-list {
  width: 100%;
}

.data-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--v-divider-base);
}

.data-list-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--v-text-primary);
  margin: 0;
}

.data-list-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-list-content {
  min-height: 100px;
}

.data-list-loading {
  padding: 16px 0;
}

.data-list-empty {
  padding: 32px 16px;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-text {
  color: var(--v-text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.data-list-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--v-divider-base);
}

/* Variants */
.data-list--dense .data-list-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
}

.data-list--comfortable .data-list-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
}

/* Bordered variant */
.data-list--bordered {
  border: 1px solid var(--v-divider-base);
  border-radius: 8px;
  padding: 16px;
}

.data-list--bordered .data-list-header {
  border-bottom: 1px solid var(--v-divider-base);
  margin: -16px -16px 16px -16px;
  padding: 16px;
}

.data-list--bordered .data-list-footer {
  margin: 16px -16px -16px -16px;
  padding: 16px;
  border-top: 1px solid var(--v-divider-base);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .data-list-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .data-list-header-actions {
    justify-content: flex-end;
  }
}
</style> 