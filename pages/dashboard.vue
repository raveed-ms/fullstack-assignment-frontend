<template>
  <PageLayout>
    <!-- Loading State -->
    <ClientOnly>
      <v-skeleton-loader v-if="isInitializing" type="card" class="mb-4" />
    </ClientOnly>
    
    <!-- Welcome Section -->
    <ClientOnly>
      <v-card v-if="!isInitializing" class="mb-6">
        <v-card-title class="text-h4">Welcome, {{ userName }}! 👋</v-card-title>
        <v-card-subtitle>Role: {{ userRole }} | Email: {{ userEmail }}</v-card-subtitle>
        <v-card-actions>
          <v-btn color="error" variant="outlined" @click="handleLogout" :loading="isLoading">Logout</v-btn>
        </v-card-actions>
      </v-card>
    </ClientOnly>

    <!-- Role-Based Content -->
    <!-- All Users Section (for all authenticated users) -->
    <DashboardSection :show="true">
      <v-col cols="12" md="6" lg="4">
        <DashboardCard
          title="All Users"
          description="View all users in the system"
          icon="mdi-account-multiple"
          icon-color="info"
          button-text="View Users"
          button-color="info"
          to="/users"
        />
      </v-col>
    </DashboardSection>








  </PageLayout>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ title: 'Dashboard' })

const {
  // State
  isLoading,
  isInitializing,
  
  // Getters
  isAuthenticated,
  isAdmin,
  isModerator,
  isUser,
  userName,
  userEmail,
  userRole,
  
  // Methods
  logout
} = useAuth()

const handleLogout = async () => {
  try {
    await logout()
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script> 