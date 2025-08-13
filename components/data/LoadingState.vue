<template>
  <div class="loading-state" :class="stateClass">
    <!-- Skeleton Loader -->
    <div v-if="type === 'skeleton'" class="loading-skeleton">
      <v-skeleton-loader
        :type="skeletonType"
        :loading="true"
        class="mx-auto"
      />
    </div>

    <!-- Spinner Loader -->
    <div v-else-if="type === 'spinner'" class="loading-spinner">
      <v-progress-circular
        :size="spinnerSize"
        :width="spinnerWidth"
        :color="spinnerColor"
        indeterminate
      />
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>

    <!-- Linear Progress -->
    <div v-else-if="type === 'linear'" class="loading-linear">
      <v-progress-linear
        :color="progressColor"
        indeterminate
        height="4"
      />
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>

    <!-- Custom Content -->
    <div v-else-if="type === 'custom'" class="loading-custom">
      <slot>
        <v-icon :size="iconSize" :color="iconColor" class="loading-icon">
          mdi-loading
        </v-icon>
        <p v-if="message" class="loading-message">{{ message }}</p>
      </slot>
    </div>

    <!-- Default Loading -->
    <div v-else class="loading-default">
      <v-progress-circular
        :size="spinnerSize"
        :width="spinnerWidth"
        :color="spinnerColor"
        indeterminate
      />
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'skeleton' | 'spinner' | 'linear' | 'custom' | 'default'
  message?: string
  skeletonType?: string
  spinnerSize?: number | string
  spinnerWidth?: number
  spinnerColor?: string
  progressColor?: string
  iconSize?: number | string
  iconColor?: string
  variant?: 'default' | 'compact' | 'comfortable'
  centered?: boolean
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  skeletonType: 'list-item-two-line',
  spinnerSize: 48,
  spinnerWidth: 4,
  spinnerColor: 'primary',
  progressColor: 'primary',
  iconSize: 48,
  iconColor: 'primary',
  variant: 'default',
  centered: true,
  fullHeight: false
})

const stateClass = computed(() => ({
  'loading-state': true,
  [`loading-state--${props.variant}`]: true,
  'loading-state--centered': props.centered,
  'loading-state--full-height': props.fullHeight
}))
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.loading-skeleton {
  width: 100%;
  max-width: 400px;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-linear {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-default {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

.loading-message {
  font-size: 0.875rem;
  color: var(--v-text-secondary);
  margin: 0;
  text-align: center;
}

/* Variants */
.loading-state--compact {
  padding: 16px 8px;
}

.loading-state--compact .loading-message {
  font-size: 0.75rem;
}

.loading-state--comfortable {
  padding: 48px 24px;
}

.loading-state--comfortable .loading-message {
  font-size: 1rem;
}

/* Centered variant */
.loading-state--centered {
  justify-content: center;
  min-height: 200px;
}

/* Full height variant */
.loading-state--full-height {
  min-height: 100vh;
}

/* Animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .loading-state {
    padding: 24px 12px;
  }

  .loading-message {
    font-size: 0.875rem;
  }
}
</style> 