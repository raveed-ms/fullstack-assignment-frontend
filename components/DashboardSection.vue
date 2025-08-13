<template>
  <ClientOnly>
    <template v-if="show">
      <v-row>
        <slot />
      </v-row>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

defineProps<Props>()
</script> 