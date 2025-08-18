<template>
  <div class="access-denied-wrapper">
    <ClientOnly>
      <template #default>
        <v-container fluid class="fill-height bg-grey-lighten-4 pa-0 ma-0" style="min-height: 100vh;">
          <v-row class="fill-height ma-0" justify="center" align="center">
            <v-col cols="12" sm="8" md="6" lg="4" class="d-flex align-center">
              <v-card class="text-center pa-6 w-100" elevation="8">
                <v-card-title class="text-h3 mb-6 text-error">
                  Access Denied
                </v-card-title>
                <v-card-text>
                  <v-icon icon="mdi-shield-alert" size="x-large" color="error" class="mb-6"></v-icon>
                  <p class="text-body-1 mb-6">{{ accessDeniedMessage }}</p>
                  <v-btn
                    color="primary"
                    size="large"
                    @click="goBack"
                    prepend-icon="mdi-arrow-left"
                    class="mb-4"
                  >
                    Go Back
                  </v-btn>
                  <v-btn
                    color="secondary"
                    size="large"
                    to="/"
                    prepend-icon="mdi-home"
                    variant="outlined"
                    block
                  >
                    Return to Home
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
      
      <template #fallback>
        <div class="access-denied-fallback">
          <h1>Access Denied</h1>
          <p>Loading...</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

// Define page meta to use auth layout (no navbar)
definePageMeta({
  layout: 'auth'
});

const route = useRoute();
const router = useRouter();

// Get the reason from the query parameter
const reason = computed(() => route.query.reason as string || 'insufficient-permissions');

// Map reasons to user-friendly messages
const accessDeniedMessage = computed(() => {
  const messages: Record<string, string> = {
    'admin-required': 'You need administrator privileges to access this page.',
    'moderator-required': 'You need moderator privileges to access this page.',
    'insufficient-permissions': 'You do not have the required permissions to access this page.',
    'blacklisted': 'Your account has been blacklisted. Please contact support.'
  };
  
  return messages[reason.value] || messages['insufficient-permissions'];
});

// Navigate back function
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.access-denied-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.access-denied-fallback {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
}

.access-denied-fallback h1 {
  margin-bottom: 1.5rem;
  color: #d32f2f;
}
</style>
