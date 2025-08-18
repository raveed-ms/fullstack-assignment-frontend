<template>
  <v-app-bar color="primary" app height="80">
    <!-- Sidebar toggle button (only shown when showToggleSidebar prop is true) -->
    <v-app-bar-nav-icon
      v-if="showToggleSidebar && userStore.isAuthenticated" 
      @click="$emit('toggle-sidebar')"
      class="text-white me-2"
    ></v-app-bar-nav-icon>
    
    <v-app-bar-title>
      <v-btn variant="text" to="/" class="text-white text-h6 font-weight-bold">
        Game CMS
      </v-btn>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Navigation links -->
    <div class="d-none d-sm-flex">
      <!-- Public links -->
      <template v-if="!userStore.isAuthenticated">
        <v-btn to="/login" variant="text" class="text-white">
          <v-icon start>mdi-login</v-icon>
          Login
        </v-btn>
      </template>

      <!-- Authenticated user links -->
      <template v-else>
        <!-- Role badge -->
        <div class="d-flex align-center">
          <v-chip 
            v-if="userStore.user" 
            :color="getRoleColor(userStore.user.role)" 
            class="me-2 role-chip" 
            size="small"
            variant="flat"
          >
            {{ userStore.user.role.toUpperCase() }}
          </v-chip>
        </div>

        <!-- User dropdown -->
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" class="text-white profile-btn" size="large">
              <v-icon start size="large">mdi-account-circle</v-icon>
              <span class="profile-text">{{ userStore.user?.name }}</span>
              <v-icon end>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/profile">
              <template v-slot:prepend>
                <v-icon>mdi-account</v-icon>
              </template>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout">
              <template v-slot:prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </div>

    <!-- Mobile menu -->
    <v-app-bar-nav-icon 
      class="d-flex d-sm-none text-white" 
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <!-- Mobile navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
    >
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">
            Menu
          </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Public links -->
        <template v-if="!userStore.isAuthenticated">
          <v-list-item to="/login" @click="drawer = false">
            <template v-slot:prepend>
              <v-icon>mdi-login</v-icon>
            </template>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
        </template>

        <!-- Authenticated user links -->
        <template v-else>


          <v-list-item v-if="userStore.user">
            <template v-slot:prepend>
              <v-icon :color="getRoleColor(userStore.user.role)">mdi-shield</v-icon>
            </template>
            <v-list-item-title>
              Role:               <v-chip
                :color="getRoleColor(userStore.user.role)"
                size="x-small"
                class="role-chip"
                variant="flat"
              >{{ userStore.user.role.toUpperCase() }}</v-chip>
            </v-list-item-title>
          </v-list-item>

          <v-list-item to="/profile" @click="drawer = false">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

// Props
defineProps({
  showToggleSidebar: {
    type: Boolean,
    default: false
  }
});

// Emits
defineEmits(['toggle-sidebar']);

const userStore = useUserStore();
const router = useRouter();
const drawer = ref(false);

const logout = () => {
  userStore.logout();
  router.push('/login');
};

const handleLogout = () => {
  drawer.value = false;
  logout();
};

// Get color based on user role
const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'accent';
    case 'mod':
      return 'secondary';
    default:
      return 'primary';
  }
};
</script>

<style scoped>
.role-chip {
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  /* margin-top: 0;
  margin-bottom: 0; */
}

/* Fix for vertical alignment in navbar */
/* .d-flex.align-center {
  height: 100%;
} */

/* Profile button styling */
.profile-btn {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 8px 16px;
}

.profile-text {
  margin: 0 8px;
}

/* Custom styling for role chips */
:deep(.role-chip.v-chip--color-accent) {
  background-color: #166088 !important;
  color: white !important;
}

:deep(.role-chip.v-chip--color-secondary) {
  background-color: #6b8cae !important;
  color: white !important;
}

:deep(.role-chip.v-chip--color-primary) {
  background-color: #4a6fa5 !important;
  color: white !important;
}
</style>
