<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :block="block"
    :rounded="rounded"
    :elevation="elevation"
    :class="buttonClass"
    @click="handleClick"
  >
    <v-icon v-if="icon && !iconRight" :icon="icon" :class="iconClass" />
    <slot />
    <v-icon v-if="icon && iconRight" :icon="icon" :class="iconClass" />
  </v-btn>
</template>

<script setup lang="ts">
interface BaseButtonProps {
  color?: string
  variant?: 'text' | 'flat' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  rounded?: boolean
  elevation?: number
  icon?: string
  iconRight?: boolean
  iconClass?: string
  buttonClass?: string
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  color: 'primary',
  variant: 'elevated',
  size: 'default',
  disabled: false,
  loading: false,
  block: false,
  rounded: false,
  elevation: 2,
  iconRight: false,
  iconClass: 'mr-1',
  buttonClass: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.v-btn {
  text-transform: none;
  font-weight: 500;
}
</style> 