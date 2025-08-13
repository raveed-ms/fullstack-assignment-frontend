<template>
  <v-list-item
    :to="route"
    :active="isActive"
    :disabled="disabled"
    :class="itemClass"
    @click="handleClick"
  >
    <template v-slot:prepend>
      <v-icon :icon="icon" :color="iconColor" />
    </template>

    <v-list-item-title>{{ label }}</v-list-item-title>

    <template v-slot:append v-if="showBadge">
      <v-badge
        :content="badgeContent"
        :color="badgeColor"
        :dot="badgeDot"
      />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
interface NavItemProps {
  label: string
  icon: string
  route: string
  isActive?: boolean
  disabled?: boolean
  showBadge?: boolean
  badgeContent?: string | number
  badgeColor?: string
  badgeDot?: boolean
  itemClass?: string
}

const props = withDefaults(defineProps<NavItemProps>(), {
  isActive: false,
  disabled: false,
  showBadge: false,
  badgeColor: 'error',
  badgeDot: false,
  itemClass: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

const iconColor = computed(() => {
  if (props.disabled) return 'disabled'
  if (props.isActive) return 'primary'
  return 'default'
})

const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.v-list-item {
  border-radius: 8px;
  margin: 2px 8px;
  transition: all 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

.v-list-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 