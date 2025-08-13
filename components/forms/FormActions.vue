<template>
  <div class="form-actions" :class="alignmentClass">
    <!-- Left Actions -->
    <div v-if="$slots.left || showReset" class="form-actions-left">
      <slot name="left" />
      <BaseButton
        v-if="showReset"
        variant="outlined"
        color="secondary"
        :disabled="loading"
        @click="$emit('reset')"
      >
        <v-icon class="mr-1">mdi-refresh</v-icon>
        {{ resetText }}
      </BaseButton>
    </div>

    <!-- Center Actions -->
    <div v-if="$slots.center" class="form-actions-center">
      <slot name="center" />
    </div>

    <!-- Right Actions -->
    <div class="form-actions-right">
      <slot name="right" />
      <BaseButton
        v-if="showCancel"
        variant="text"
        color="secondary"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        {{ cancelText }}
      </BaseButton>
      <BaseButton
        v-if="showSubmit"
        :color="submitColor"
        :variant="submitVariant"
        :loading="loading"
        :disabled="disabled || loading"
        @click="$emit('submit')"
      >
        <v-icon v-if="submitIcon" class="mr-1">{{ submitIcon }}</v-icon>
        {{ submitText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

interface Props {
  loading?: boolean
  disabled?: boolean
  showSubmit?: boolean
  showCancel?: boolean
  showReset?: boolean
  submitText?: string
  cancelText?: string
  resetText?: string
  submitIcon?: string
  submitColor?: string
  submitVariant?: 'text' | 'outlined' | 'elevated'
  alignment?: 'left' | 'center' | 'right' | 'space-between'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  showSubmit: true,
  showCancel: false,
  showReset: false,
  submitText: 'Submit',
  cancelText: 'Cancel',
  resetText: 'Reset',
  submitColor: 'primary',
  submitVariant: 'elevated',
  alignment: 'right'
})

const emit = defineEmits<{
  submit: []
  cancel: []
  reset: []
}>()

const alignmentClass = computed(() => `alignment-${props.alignment}`)
</script>

<style scoped>
.form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--v-divider-base);
}

.form-actions-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Alignment variants */
.alignment-left {
  justify-content: flex-start;
}

.alignment-center {
  justify-content: center;
}

.alignment-right {
  justify-content: flex-end;
}

.alignment-space-between {
  justify-content: space-between;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 16px;
  }

  .form-actions-left,
  .form-actions-center,
  .form-actions-right {
    width: 100%;
    justify-content: center;
  }
}
</style> 