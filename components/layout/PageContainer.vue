<template>
  <div class="page-container" :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'compact' | 'normal' | 'comfortable'
  centered?: boolean
  fluid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'lg',
  padding: 'normal',
  centered: true,
  fluid: false
})

const containerClass = computed(() => ({
  'page-container': true,
  [`page-container--max-width-${props.maxWidth}`]: true,
  [`page-container--padding-${props.padding}`]: true,
  'page-container--centered': props.centered,
  'page-container--fluid': props.fluid
}))
</script>

<style scoped>
.page-container {
  width: 100%;
  margin: 0 auto;
}

/* Max width variants */
.page-container--max-width-xs {
  max-width: 480px;
}

.page-container--max-width-sm {
  max-width: 640px;
}

.page-container--max-width-md {
  max-width: 768px;
}

.page-container--max-width-lg {
  max-width: 1024px;
}

.page-container--max-width-xl {
  max-width: 1280px;
}

.page-container--max-width-full {
  max-width: none;
}

/* Padding variants */
.page-container--padding-none {
  padding: 0;
}

.page-container--padding-compact {
  padding: 16px;
}

.page-container--padding-normal {
  padding: 24px;
}

.page-container--padding-comfortable {
  padding: 32px;
}

/* Centered */
.page-container--centered {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Fluid */
.page-container--fluid {
  max-width: none;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-container--padding-normal {
    padding: 16px;
  }

  .page-container--padding-comfortable {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .page-container--padding-normal {
    padding: 12px;
  }

  .page-container--padding-comfortable {
    padding: 16px;
  }
}
</style> 