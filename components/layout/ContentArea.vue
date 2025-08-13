<template>
  <main class="content-area" :class="areaClass">
    <slot />
  </main>
</template>

<script setup lang="ts">
interface Props {
  padding?: 'none' | 'compact' | 'normal' | 'comfortable'
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  centered?: boolean
  fluid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'normal',
  maxWidth: 'lg',
  centered: true,
  fluid: false
})

const areaClass = computed(() => ({
  'content-area': true,
  [`content-area--padding-${props.padding}`]: true,
  [`content-area--max-width-${props.maxWidth}`]: true,
  'content-area--centered': props.centered,
  'content-area--fluid': props.fluid
}))
</script>

<style scoped>
.content-area {
  flex: 1;
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px); /* Account for app bar */
}

/* Padding variants */
.content-area--padding-none {
  padding: 0;
}

.content-area--padding-compact {
  padding: 16px;
}

.content-area--padding-normal {
  padding: 24px;
}

.content-area--padding-comfortable {
  padding: 32px;
}

/* Max width variants */
.content-area--max-width-xs {
  max-width: 480px;
}

.content-area--max-width-sm {
  max-width: 640px;
}

.content-area--max-width-md {
  max-width: 768px;
}

.content-area--max-width-lg {
  max-width: 1024px;
}

.content-area--max-width-xl {
  max-width: 1280px;
}

.content-area--max-width-full {
  max-width: none;
}

/* Centered */
.content-area--centered {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Fluid */
.content-area--fluid {
  max-width: none;
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-area--padding-normal {
    padding: 16px;
  }

  .content-area--padding-comfortable {
    padding: 24px;
  }
}

@media (max-width: 480px) {
  .content-area--padding-normal {
    padding: 12px;
  }

  .content-area--padding-comfortable {
    padding: 16px;
  }
}
</style> 