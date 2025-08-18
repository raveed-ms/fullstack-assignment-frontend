<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
    width="280"
    @click="rail = false"
  >
    <v-list-item
      :title="userStore.user?.name || 'Guest'"
      :subtitle="userStore.user?.email || ''"
      class="sidebar-header"
    >
      <template v-slot:prepend>
        <div class="d-flex flex-column align-center">
          <v-avatar color="primary" class="user-avatar mb-2">
            <v-icon color="white" size="large">mdi-account-circle</v-icon>
          </v-avatar>
          <v-chip
            v-if="userStore.user && !rail"
            :color="getRoleColor(userStore.user.role)"
            size="x-small"
            class="role-chip"
            variant="flat"
          >{{ userStore.user.role.toUpperCase() }}</v-chip>
        </div>
      </template>

    </v-list-item>

    <v-divider></v-divider>

    <v-list nav class="sidebar-list">
      <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard" title="Dashboard" class="sidebar-item"></v-list-item>
      
      <v-list-item to="/profile" prepend-icon="mdi-account" title="My Profile" class="sidebar-item"></v-list-item>
      
      <!-- Events Navigation -->
      <v-list-item to="/events" prepend-icon="mdi-calendar" title="Events" class="sidebar-item"></v-list-item>
      
      <!-- Seasons Navigation with Dropdown -->
      <v-list-group value="seasons">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-calendar-month"
            title="Seasons"
            class="sidebar-item"
          ></v-list-item>
        </template>
        
        <v-list-item 
          to="/seasons" 
          prepend-icon="mdi-calendar-month" 
          title="All Seasons" 
          class="sidebar-sub-item"
        ></v-list-item>
        
        <v-list-item 
          v-if="userStore.isAdmin"
          to="/seasons/changelogs" 
          prepend-icon="mdi-history" 
          title="Change Logs" 
          class="sidebar-sub-item"
        ></v-list-item>
      </v-list-group>
      
      <!-- Players Navigation with Dropdown -->
      <v-list-group value="players">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-account-group"
            title="Players"
            class="sidebar-item"
          ></v-list-item>
        </template>
        
        <v-list-item 
          to="/players" 
          prepend-icon="mdi-account-multiple" 
          title="All Players" 
          class="sidebar-sub-item"
        ></v-list-item>
        
        <v-list-item 
          v-if="userStore.isAdmin"
          to="/players/changelogs" 
          prepend-icon="mdi-history" 
          title="Change Logs" 
          class="sidebar-sub-item"
        ></v-list-item>
      </v-list-group>
      
      <!-- Users Navigation -->
      <v-list-item to="/users" prepend-icon="mdi-account-multiple-outline" title="Users" class="sidebar-item"></v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          block
          variant="outlined"
          color="error"
          prepend-icon="mdi-logout"
          @click="logout"
          class="sidebar-logout-btn"
          size="large"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const userStore = useUserStore();
const router = useRouter();
const rail = ref(false);

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const logout = () => {
  userStore.logout();
  router.push('/login');
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
/* Sidebar navigation styling */
.sidebar-list {
  padding: 12px 0;
}

/* Make list items larger */
:deep(.sidebar-item) {
  min-height: 56px;
  padding: 12px 16px;
  margin-bottom: 4px;
}

/* Style sub-items in dropdown */
:deep(.sidebar-sub-item) {
  min-height: 48px;
  padding: 8px 16px 8px 48px;
  margin-bottom: 2px;
}

:deep(.sidebar-sub-item .v-icon) {
  font-size: 20px;
  margin-right: 16px;
}

/* Make sub-item text same size as main items */
:deep(.sidebar-sub-item .v-list-item-title) {
  font-size: 1.1rem;
  font-weight: 500;
}

/* Increase icon size */
:deep(.sidebar-item .v-icon) {
  font-size: 24px;
  margin-right: 16px;
}

/* Increase text size */
:deep(.sidebar-item .v-list-item-title) {
  font-size: 1.1rem;
  font-weight: 500;
}

/* Header styling */
:deep(.sidebar-header) {
  padding: 16px;
}

:deep(.sidebar-header .v-list-item__prepend) {
  margin-right: 16px;
  display: flex;
  align-items: center;
}

:deep(.sidebar-header .v-avatar) {
  width: 48px;
  height: 48px;
}

:deep(.user-avatar) {
  background-color: #4a6fa5 !important;
  min-width: 48px;
  min-height: 48px;
}

:deep(.v-list-item-title) {
  height: 1.5rem;
}

:deep(.sidebar-header .v-list-item-title) {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 4px;
}

:deep(.sidebar-header .v-list-item-subtitle) {
  font-size: 0.9rem;
}

/* Logout button styling */
.sidebar-logout-btn {
  font-size: 1.1rem;
  font-weight: 500;
  padding: 12px 0;
  border-width: 2px;
  transition: all 0.2s ease;
}

.sidebar-logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.sidebar-logout-btn .v-icon) {
  font-size: 20px;
}

/* Role chip styling */
.role-chip {
  font-weight: bold;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
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
