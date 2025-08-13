<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="type"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :clearable="clearable"
    :density="density"
    :variant="variant"
    :color="color"
    :error-messages="errorMessages"
    :hint="hint"
    :persistent-hint="persistentHint"
    :prepend-inner-icon="prependIcon"
    :append-inner-icon="appendIcon"
    :class="inputClass"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
interface BaseInputProps {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  density?: 'default' | 'comfortable' | 'compact'
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
  color?: string
  errorMessages?: string | string[]
  hint?: string
  persistentHint?: boolean
  prependIcon?: string
  appendIcon?: string
  inputClass?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  density: 'default',
  variant: 'outlined',
  color: 'primary',
  persistentHint: false,
  inputClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const handleInput = (value: string | number) => {
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
.v-text-field {
  margin-bottom: 16px;
}
</style> 