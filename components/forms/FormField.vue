<template>
  <div class="form-field">
    <BaseInput
      v-if="type === 'input'"
      v-model="fieldValue"
      :label="label"
      :placeholder="placeholder"
      :type="inputType"
      :disabled="disabled"
      :required="required"
      :clearable="clearable"
      :error-messages="errorMessages"
      :hint="hint"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <BaseSelect
      v-else-if="type === 'select'"
      v-model="fieldValue"
      :items="items"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :clearable="clearable"
      :multiple="multiple"
      :error-messages="errorMessages"
      :hint="hint"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <v-textarea
      v-else-if="type === 'textarea'"
      v-model="fieldValue"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :clearable="clearable"
      :error-messages="errorMessages"
      :hint="hint"
      :prepend-inner-icon="prependIcon"
      :append-inner-icon="appendIcon"
      :rows="rows"
      :auto-grow="autoGrow"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <v-checkbox
      v-else-if="type === 'checkbox'"
      v-model="fieldValue"
      :label="label"
      :disabled="disabled"
      :required="required"
      :error-messages="errorMessages"
      :hint="hint"
    />

    <v-radio-group
      v-else-if="type === 'radio'"
      v-model="fieldValue"
      :label="label"
      :disabled="disabled"
      :required="required"
      :error-messages="errorMessages"
      :hint="hint"
    >
      <v-radio
        v-for="item in items"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'

interface FormFieldProps {
  modelValue?: any
  type: 'input' | 'select' | 'textarea' | 'checkbox' | 'radio'
  label?: string
  placeholder?: string
  inputType?: string
  items?: any[]
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  multiple?: boolean
  errorMessages?: string | string[]
  hint?: string
  prependIcon?: string
  appendIcon?: string
  rows?: number
  autoGrow?: boolean
}

const props = withDefaults(defineProps<FormFieldProps>(), {
  modelValue: '',
  inputType: 'text',
  items: () => [],
  disabled: false,
  required: false,
  clearable: false,
  multiple: false,
  rows: 3,
  autoGrow: true
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const fieldValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 16px;
}
</style> 