<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth"
    :persistent="persistent"
    :scrollable="scrollable"
    :fullscreen="fullscreen"
    :class="dialogClass"
    @update:model-value="handleUpdate"
  >
    <v-card :class="cardClass">
      <v-card-title v-if="title || $slots.title" :class="titleClass">
        <slot name="title">{{ title }}</slot>
        <v-spacer />
        <v-btn
          v-if="showCloseButton"
          icon="mdi-close"
          variant="text"
          size="small"
          @click="handleClose"
        />
      </v-card-title>

      <v-card-text v-if="$slots.default" :class="contentClass">
        <slot />
      </v-card-text>

      <v-card-actions v-if="$slots.actions || showDefaultActions" :class="actionsClass">
        <slot name="actions">
          <v-spacer />
          <BaseButton
            v-if="showCancelButton"
            variant="text"
            @click="handleCancel"
          >
            {{ cancelText }}
          </BaseButton>
          <BaseButton
            v-if="showConfirmButton"
            color="primary"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </BaseButton>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import BaseButton from './BaseButton.vue'

interface BaseModalProps {
  modelValue: boolean
  title?: string
  maxWidth?: string | number
  persistent?: boolean
  scrollable?: boolean
  fullscreen?: boolean
  showCloseButton?: boolean
  showDefaultActions?: boolean
  showCancelButton?: boolean
  showConfirmButton?: boolean
  cancelText?: string
  confirmText?: string
  dialogClass?: string
  cardClass?: string
  titleClass?: string
  contentClass?: string
  actionsClass?: string
}

const props = withDefaults(defineProps<BaseModalProps>(), {
  modelValue: false,
  maxWidth: 500,
  persistent: false,
  scrollable: false,
  fullscreen: false,
  showCloseButton: true,
  showDefaultActions: false,
  showCancelButton: true,
  showConfirmButton: true,
  cancelText: 'Cancel',
  confirmText: 'Confirm',
  dialogClass: '',
  cardClass: '',
  titleClass: '',
  contentClass: '',
  actionsClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  cancel: []
  confirm: []
}>()

const handleUpdate = (value: boolean) => {
  emit('update:modelValue', value)
}

const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.v-dialog {
  z-index: 1000;
}

.v-card-title {
  font-weight: 600;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
}
</style> 