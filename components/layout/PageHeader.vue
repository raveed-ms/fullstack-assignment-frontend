<template>
  <div class="page-header" :class="headerClass">
    <!-- Breadcrumbs -->
    <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="page-breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" class="px-0">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </nav>

    <!-- Header Content -->
    <div class="page-header-content">
      <div class="page-header-main">
        <h1 v-if="title" class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      </div>

      <div v-if="$slots.actions" class="page-header-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Header Footer -->
    <div v-if="$slots.footer" class="page-header-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  title: string
  href?: string
  disabled?: boolean
}

interface Props {
  title?: string
  subtitle?: string
  breadcrumbs?: Breadcrumb[]
  variant?: 'default' | 'compact' | 'comfortable'
  showDivider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  showDivider: true
})

const headerClass = computed(() => ({
  'page-header': true,
  [`page-header--${props.variant}`]: true,
  'page-header--with-divider': props.showDivider
}))
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-breadcrumbs {
  margin-bottom: 16px;
}

.page-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.page-header-main {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--v-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--v-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.page-header-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--v-divider-base);
}

/* Variants */
.page-header--compact {
  margin-bottom: 16px;
}

.page-header--compact .page-title {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.page-header--compact .page-subtitle {
  font-size: 0.875rem;
}

.page-header--comfortable {
  margin-bottom: 32px;
}

.page-header--comfortable .page-title {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.page-header--comfortable .page-subtitle {
  font-size: 1.125rem;
}

/* Divider */
.page-header--with-divider {
  padding-bottom: 16px;
  border-bottom: 1px solid var(--v-divider-base);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .page-header-actions {
    justify-content: flex-end;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
  }
}
</style> 