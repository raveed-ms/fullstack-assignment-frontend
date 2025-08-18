<template>
  <div class="dashboard-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="fill-height bg-grey-lighten-4 pa-6 ma-0" style="min-height: 100vh;">
          <v-row class="ma-0">
            <v-col cols="12">
              <v-card class="pa-6" elevation="4">
                <v-card-title class="text-h4 mb-4">Dashboard</v-card-title>
                <v-card-text>
                  <div v-if="userStore.user" class="user-info mb-6">
                    <h2 class="text-h5 mb-4">Welcome, {{ userStore.user.name }}</h2>
                    <v-chip
                      :color="roleColor"
                      class="mb-4"
                      size="large"
                    >
                      {{ userStore.user.role.toUpperCase() }}
                    </v-chip>
                    <p class="text-body-1">
                      <strong>Email:</strong> {{ userStore.user.email }}
                    </p>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="actions mt-6">
                    <v-btn
                      color="primary"
                      size="large"
                      prepend-icon="mdi-account"
                      class="me-4 mb-4"
                    >
                      My Account
                    </v-btn>
                    
                    <v-btn
                      color="secondary"
                      size="large"
                      prepend-icon="mdi-cog"
                      class="me-4 mb-4"
                    >
                      Settings
                    </v-btn>
                    
                    <v-btn
                      color="error"
                      size="large"
                      prepend-icon="mdi-logout"
                      class="mb-4"
                      @click="logout"
                      variant="outlined"
                    >
                      Logout
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template #fallback>
        <div class="dashboard-fallback">
          <p>Loading dashboard...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

// Define page meta for auth middleware and layout
definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'authenticated'
});

const userStore = useUserStore();
const router = useRouter();

// Compute role color based on user role
const roleColor = computed(() => {
  if (!userStore.user) return 'grey';
  
  switch (userStore.user.role) {
    case 'admin':
      return 'error';
    case 'mod':
      return 'warning';
    default:
      return 'info';
  }
});

// Logout function
const logout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.dashboard-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.user-info {
  padding: 1rem 0;
}

.dashboard-fallback {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 1.2rem;
  color: #4a6fa5;
}
</style>
