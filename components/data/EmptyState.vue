<template>
  <div class="empty-state" :class="stateClass">
    <!-- Icon -->
    <div v-if="icon || $slots.icon" class="empty-state-icon">
      <slot name="icon">
        <v-icon :size="iconSize" :color="iconColor">{{ icon }}</v-icon>
      </slot>
    </div>

    <!-- Title -->
    <h3 v-if="title" class="empty-state-title">{{ title }}</h3>

    <!-- Description -->
    <p v-if="description" class="empty-state-description">{{ description }}</p>

    <!-- Actions -->
    <div v-if="$slots.actions || showDefaultAction" class="empty-state-actions">
      <slot name="actions">
        <BaseButton
          v-if="showDefaultAction"
          :color="actionColor"
          :variant="actionVariant"
          @click="$emit('action')"
        >
          <v-icon v-if="actionIcon" class="mr-1">{{ actionIcon }}</v-icon>
          {{ actionText }}
        </BaseButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  title?: string
  description?: string
  icon?: string
  iconSize?: number | string
  iconColor?: string
  showDefaultAction?: boolean
  actionText?: string
  actionIcon?: string
  actionColor?: string
  actionVariant?: 'text' | 'outlined' | 'elevated'
  variant?: 'default' | 'compact' | 'comfortable'
  centered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-inbox-outline',
  iconSize: 64,
  iconColor: 'grey-lighten-1',
  showDefaultAction: false,
  actionText: 'Get Started',
  actionIcon: 'mdi-plus',
  actionColor: 'primary',
  actionVariant: 'elevated',
  variant: 'default',
  centered: true
})

const emit = defineEmits<{
  action: []
}>()

const stateClass = computed(() => ({
  'empty-state': true,
  [`empty-state--${props.variant}`]: true,
  'empty-state--centered': props.centered
}))
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state-icon {
  margin-bottom: 16px;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--v-text-primary);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.empty-state-description {
  font-size: 0.875rem;
  color: var(--v-text-secondary);
  margin: 0 0 24px 0;
  line-height: 1.5;
  max-width: 400px;
}

.empty-state-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Variants */
.empty-state--compact {
  padding: 32px 16px;
}

.empty-state--compact .empty-state-icon {
  margin-bottom: 12px;
}

.empty-state--compact .empty-state-title {
  font-size: 1.125rem;
  margin-bottom: 6px;
}

.empty-state--compact .empty-state-description {
  margin-bottom: 16px;
}

.empty-state--comfortable {
  padding: 64px 32px;
}

.empty-state--comfortable .empty-state-icon {
  margin-bottom: 20px;
}

.empty-state--comfortable .empty-state-title {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.empty-state--comfortable .empty-state-description {
  margin-bottom: 32px;
  font-size: 1rem;
}

/* Centered variant */
.empty-state--centered {
  justify-content: center;
  min-height: 300px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .empty-state {
    padding: 32px 16px;
  }

  .empty-state-title {
    font-size: 1.125rem;
  }

  .empty-state-description {
    font-size: 0.875rem;
  }

  .empty-state-actions {
    flex-direction: column;
    width: 100%;
  }
}
</style> 