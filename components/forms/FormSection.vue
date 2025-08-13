<template>
  <div class="form-section">
    <!-- Section Header -->
    <div v-if="title || description" class="form-section-header">
      <h3 v-if="title" class="form-section-title">{{ title }}</h3>
      <p v-if="description" class="form-section-description">{{ description }}</p>
    </div>

    <!-- Section Content -->
    <div class="form-section-content">
      <slot />
    </div>

    <!-- Section Footer -->
    <div v-if="$slots.footer" class="form-section-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  spacing?: 'compact' | 'normal' | 'loose'
}

const props = withDefaults(defineProps<Props>(), {
  spacing: 'normal'
})
</script>

<style scoped>
.form-section {
  margin-bottom: 24px;
}

.form-section-header {
  margin-bottom: 16px;
}

.form-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--v-primary-base);
  margin: 0 0 8px 0;
}

.form-section-description {
  font-size: 0.875rem;
  color: var(--v-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.form-section-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--v-divider-base);
}

/* Spacing variants */
.form-section.spacing-compact {
  margin-bottom: 16px;
}

.form-section.spacing-loose {
  margin-bottom: 32px;
}
</style> 