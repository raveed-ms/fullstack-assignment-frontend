<template>
  <PageLayout>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-card class="pa-8">
          <v-card-title class="text-h3 mb-4">
            <v-icon size="64" color="primary" class="mb-4">mdi-account-group</v-icon>
            <br>
            User Management System
          </v-card-title>
          
          <v-card-text class="text-h6 mb-6">
            A comprehensive user management system with role-based access control
          </v-card-text>

          <ClientOnly>
            <template v-if="isAuthenticated">
              <v-btn
                color="primary"
                size="large"
                class="mr-4"
                @click="navigateTo('/dashboard')"
              >
                <v-icon class="mr-2">mdi-view-dashboard</v-icon>
                Go to Dashboard
              </v-btn>
              
              <v-btn
                variant="outlined"
                size="large"
                @click="navigateTo('/profile')"
              >
                <v-icon class="mr-2">mdi-account</v-icon>
                View Profile
              </v-btn>
            </template>
            
            <template v-else>
              <v-btn
                color="primary"
                size="large"
                class="mr-4"
                @click="navigateTo('/login')"
              >
                <v-icon class="mr-2">mdi-login</v-icon>
                Login
              </v-btn>
              
              <v-btn
                variant="outlined"
                size="large"
                @click="navigateTo('/register')"
              >
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                Register
              </v-btn>
            </template>
          </ClientOnly>
        </v-card>
      </v-col>
    </v-row>
  </PageLayout>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ title: 'Home' })

const { isAuthenticated } = useAuth()
</script> 