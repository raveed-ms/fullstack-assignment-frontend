<template>
  <BaseCard :elevation="elevation" :class="cardClass">
    <!-- Card Header -->
    <template v-if="title || $slots.header" #title>
      <div class="data-card-header">
        <div class="data-card-title-section">
          <h3 v-if="title" class="data-card-title">{{ title }}</h3>
          <p v-if="subtitle" class="data-card-subtitle">{{ subtitle }}</p>
        </div>
        <div v-if="$slots.header" class="data-card-header-actions">
          <slot name="header" />
        </div>
      </div>
    </template>

    <!-- Card Content -->
    <div class="data-card-content">
      <slot />
    </div>

    <!-- Card Footer -->
    <template v-if="$slots.footer" #actions>
      <div class="data-card-footer">
        <slot name="footer" />
      </div>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'

interface Props {
  title?: string
  subtitle?: string
  elevation?: number
  variant?: 'default' | 'outlined' | 'elevated'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  elevation: 2,
  variant: 'default',
  loading: false
})

const cardClass = computed(() => ({
  'data-card': true,
  [`data-card--${props.variant}`]: true,
  'data-card--loading': props.loading
}))
</script>

<style scoped>
.data-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.data-card-title-section {
  flex: 1;
}

.data-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--v-text-primary);
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.data-card-subtitle {
  font-size: 0.875rem;
  color: var(--v-text-secondary);
  margin: 0;
  line-height: 1.4;
}

.data-card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.data-card-content {
  padding: 16px 0;
}

.data-card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--v-divider-base);
}

/* Variants */
.data-card--outlined {
  border: 1px solid var(--v-divider-base);
}

.data-card--elevated {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Loading state */
.data-card--loading .data-card-content {
  opacity: 0.6;
  pointer-events: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .data-card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .data-card-header-actions {
    justify-content: flex-end;
  }
}
</style> 