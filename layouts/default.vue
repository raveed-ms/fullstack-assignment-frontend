<template>
  <div>
    <ClientOnly>
      <v-app>
        <!-- App Navigation Bar -->
        <AppNavbar />
        
        <v-main>
          <slot />
        </v-main>
      </v-app>
      
      <template #fallback>
        <div class="loading-fallback">
          <p>Loading...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/layout/AppNavbar.vue';
</script>

<style scoped>
.loading-fallback {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
}
</style>
