<template>
  <v-select
    :model-value="modelValue"
    :items="items"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :clearable="clearable"
    :multiple="multiple"
    :density="density"
    :variant="variant"
    :color="color"
    :error-messages="errorMessages"
    :hint="hint"
    :persistent-hint="persistentHint"
    :prepend-inner-icon="prependIcon"
    :append-inner-icon="appendIcon"
    :class="selectClass"
    @update:model-value="handleChange"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
interface BaseSelectProps {
  modelValue?: any
  items?: any[]
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  multiple?: boolean
  density?: 'default' | 'comfortable' | 'compact'
  variant?: 'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'
  color?: string
  errorMessages?: string | string[]
  hint?: string
  persistentHint?: boolean
  prependIcon?: string
  appendIcon?: string
  selectClass?: string
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  modelValue: null,
  items: () => [],
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  multiple: false,
  density: 'default',
  variant: 'outlined',
  color: 'primary',
  persistentHint: false,
  selectClass: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const handleChange = (value: any) => {
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
.v-select {
  margin-bottom: 16px;
}
</style> 