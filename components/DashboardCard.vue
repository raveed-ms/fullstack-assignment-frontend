<template>
  <v-card class="mb-4">
    <v-card-title class="text-h6">
      <v-icon class="mr-2" :color="iconColor">{{ icon }}</v-icon>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <p>{{ description }}</p>
      <v-btn 
        :color="buttonColor" 
        @click="handleClick" 
        class="mt-2"
        :to="to"
        :href="href"
      >
        {{ buttonText }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
  icon: string
  iconColor?: string
  buttonText: string
  buttonColor?: string
  to?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'primary',
  buttonColor: 'primary'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script> 