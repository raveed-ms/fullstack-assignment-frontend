<template>
  <v-card
    :color="color"
    :variant="variant"
    :elevation="elevation"
    :rounded="rounded"
    :class="cardClass"
  >
    <v-card-title v-if="title || $slots.title" :class="titleClass">
      <slot name="title">{{ title }}</slot>
    </v-card-title>

    <v-card-subtitle v-if="subtitle || $slots.subtitle" :class="subtitleClass">
      <slot name="subtitle">{{ subtitle }}</slot>
    </v-card-subtitle>

    <v-card-text v-if="$slots.default" :class="contentClass">
      <slot />
    </v-card-text>

    <v-card-actions v-if="$slots.actions" :class="actionsClass">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
interface BaseCardProps {
  title?: string
  subtitle?: string
  color?: string
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  elevation?: number
  rounded?: boolean
  cardClass?: string
  titleClass?: string
  subtitleClass?: string
  contentClass?: string
  actionsClass?: string
}

const props = withDefaults(defineProps<BaseCardProps>(), {
  color: 'surface',
  variant: 'elevated',
  elevation: 2,
  rounded: true,
  cardClass: '',
  titleClass: '',
  subtitleClass: '',
  contentClass: '',
  actionsClass: ''
})
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}

.v-card-title {
  font-weight: 600;
}

.v-card-subtitle {
  font-weight: 400;
  opacity: 0.8;
}
</style> 