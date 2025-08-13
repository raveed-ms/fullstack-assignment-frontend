<template>
  <v-app-bar app color="primary" dark>
    <!-- Hamburger Menu (Left side) -->
    <HamburgerMenu
      v-model:is-open="isMobileMenuOpen"
      @nav-click="handleNavClick"
    />

    <!-- Logo/Title (Center) -->
    <v-app-bar-title @click="navigateToDashboard" style="cursor: pointer;">
      <v-icon class="mr-2">mdi-account-group</v-icon>
      User Management System
    </v-app-bar-title>

    <v-spacer />

    <!-- Profile Button (Right side) -->
    <div v-if="isAuthenticated" class="profile-section">
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            class="profile-button"
          >
            <v-icon class="mr-1">mdi-account-circle</v-icon>
            {{ userName }}
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="navigateTo('/profile')">
            <template v-slot:prepend>
              <v-icon>mdi-account-edit</v-icon>
            </template>
            <v-list-item-title>Edit Profile</v-list-item-title>
          </v-list-item>
          
          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <!-- Auth Buttons (Right side - when not authenticated) -->
    <div v-else class="auth-buttons">
      <v-btn
        variant="text"
        class="mr-2"
        @click="navigateTo('/login')"
      >
        <v-icon class="mr-1">mdi-login</v-icon>
        Login
      </v-btn>

      <v-btn
        variant="outlined"
        @click="navigateTo('/register')"
      >
        <v-icon class="mr-1">mdi-account-plus</v-icon>
        Register
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { useNavigation, type NavigationItem } from '~/composables/ui/useNavigation'
import HamburgerMenu from './HamburgerMenu.vue'

const route = useRoute()
const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)
const { updateCurrentRoute } = useNavigation()

// State
const isMobileMenuOpen = ref(false)

// Computed properties
const userName = computed(() => user.value?.name || 'Unknown User')

// Methods
const navigateToDashboard = async () => {
  if (isAuthenticated.value) {
    await navigateTo('/dashboard')
  } else {
    await navigateTo('/')
  }
}

const handleLogout = async () => {
  try {
    authStore.clearAuth()
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const handleNavClick = (item: NavigationItem) => {
  // Handle navigation item click
  console.log('Navigation clicked:', item)
}

// Watch for route changes
watch(() => route.path, (newPath) => {
  updateCurrentRoute(newPath)
}, { immediate: true })
</script>

<style scoped>
.profile-section {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.profile-button {
  color: white;
}
</style> 