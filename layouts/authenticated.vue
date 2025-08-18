<template>
  <div>
    <ClientOnly>
      <v-app>
        <!-- App Navigation Bar -->
        <AppNavbar :show-toggle-sidebar="true" @toggle-sidebar="toggleSidebar" />
        
        <!-- App Sidebar -->
        <AppSidebar v-model="sidebarOpen" />
        
        <v-main>
          <slot />
        </v-main>
      </v-app>
      
      <!-- Global Notification System -->
      <NotificationProvider />
      
      <template #fallback>
        <div class="loading-fallback">
          <p>Loading...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppNavbar from '~/components/layout/AppNavbar.vue';
import AppSidebar from '~/components/layout/AppSidebar.vue';
import NotificationProvider from '~/components/ui/NotificationProvider.vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
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
