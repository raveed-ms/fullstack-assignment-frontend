<template>
  <div class="dashboard-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="bg-grey-lighten-4 pa-0 ma-0" style="min-height: 100vh;">
          <v-row class="ma-0">
            <v-col cols="12">
              <v-card class="pa-6 dashboard-card" elevation="1">
                <v-card-title class="d-flex align-center pa-0 mb-4">
                  <v-icon start color="primary" size="large" class="mr-3">mdi-view-dashboard</v-icon>
                  <span class="text-h5 font-weight-medium">Dashboard</span>
                </v-card-title>
                <v-card-text>
                  <div v-if="userStore.user" class="user-info mb-6">
                    <h2 class="text-h6 mb-4">Welcome, {{ userStore.user.name }}</h2>
                    <v-chip
                      :color="getRoleColor(userStore.user.role)"
                      class="mb-4 role-chip"
                      size="small"
                      variant="flat"
                    >
                      {{ userStore.user.role?.toUpperCase() }}
                    </v-chip>
                    <p class="text-body-1">
                      <strong>Email:</strong> {{ userStore.user.email }}
                    </p>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="nav-cards mt-4">
                    <div class="nav-cards-row">
                      <v-card class="nav-card" variant="outlined" hover to="/profile">
                        <v-card-text class="d-flex align-center">
                          <v-icon color="primary" class="mr-3">mdi-account</v-icon>
                          <div>
                            <div class="text-subtitle-1 font-weight-600">My Profile</div>
                            <div class="text-caption text-grey">View and edit your profile</div>
                          </div>
                        </v-card-text>
                      </v-card>
                      <v-card class="nav-card" variant="outlined" hover to="/events">
                        <v-card-text class="d-flex align-center">
                          <v-icon color="primary" class="mr-3">mdi-calendar</v-icon>
                          <div>
                            <div class="text-subtitle-1 font-weight-600">Events</div>
                            <div class="text-caption text-grey">Manage events</div>
                          </div>
                        </v-card-text>
                      </v-card>
                      <v-card class="nav-card" variant="outlined" hover to="/seasons">
                        <v-card-text class="d-flex align-center">
                          <v-icon color="primary" class="mr-3">mdi-calendar-month</v-icon>
                          <div>
                            <div class="text-subtitle-1 font-weight-600">Seasons</div>
                            <div class="text-caption text-grey">Browse seasons</div>
                          </div>
                        </v-card-text>
                      </v-card>
                      <v-card class="nav-card" variant="outlined" hover to="/players">
                        <v-card-text class="d-flex align-center">
                          <v-icon color="primary" class="mr-3">mdi-account-group</v-icon>
                          <div>
                            <div class="text-subtitle-1 font-weight-600">Players</div>
                            <div class="text-caption text-grey">Search and filter players</div>
                          </div>
                        </v-card-text>
                      </v-card>
                      <v-card class="nav-card" variant="outlined" hover to="/users">
                        <v-card-text class="d-flex align-center">
                          <v-icon color="primary" class="mr-3">mdi-account-multiple-outline</v-icon>
                          <div>
                            <div class="text-subtitle-1 font-weight-600">Users</div>
                            <div class="text-caption text-grey">Browse users</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </div>
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

// Role colors consistent with AppNavbar/AppSidebar
const getRoleColor = (role: string) => {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return 'accent';
    case 'mod':
      return 'secondary';
    default:
      return 'primary';
  }
};

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

.dashboard-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.role-chip {
  font-weight: 600;
  letter-spacing: 0.3px;
}

.nav-card {
  transition: all 0.2s ease;
  cursor: pointer;
}

.nav-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.12);
}

.nav-cards-row {
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
}

.nav-cards-row .nav-card {
  min-width: 240px;
  flex: 1 1 0;
}

.logout-card:hover {
  border-color: rgba(211, 47, 47, 0.3);
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
