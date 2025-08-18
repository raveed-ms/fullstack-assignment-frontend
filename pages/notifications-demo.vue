<template>
  <div class="notifications-demo">
    <v-container fluid class="fill-height bg-grey-lighten-4 pa-6 ma-0">
      <v-row class="ma-0">
        <v-col cols="12" md="8" lg="6" class="mx-auto">
          <v-card class="pa-6" elevation="4">
            <v-card-title class="text-h4 mb-6 text-center">
              Notification System Demo
            </v-card-title>
            
            <v-card-text>
              <div class="d-flex flex-column gap-4">
                <v-btn color="success" @click="handleShowSuccess">Show Success</v-btn>
                <v-btn color="error" @click="handleShowError">Show Error</v-btn>
                <v-btn color="warning" @click="handleShowWarning">Show Warning</v-btn>
                <v-btn color="info" @click="handleShowInfo">Show Info</v-btn>
                <v-btn color="primary" @click="clearAll">Clear All</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/ui/useNotifications';

definePageMeta({
  middleware: ['auth'],
  requiresAuth: true,
  layout: 'authenticated'
});

const { showSuccess, showError, showWarning, showInfo, clearNotifications } = useNotifications();

const handleShowSuccess = () => showSuccess('Success!', 'Operation completed successfully');
const handleShowError = () => showError('Error!', 'Something went wrong');
const handleShowWarning = () => showWarning('Warning!', 'Please review your input');
const handleShowInfo = () => showInfo('Info', 'Here is some information');
const clearAll = () => clearNotifications();
</script>

<style scoped>
.notifications-demo {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.notification-section {
  padding: 16px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.notifications-demo-fallback {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  text-align: center;
  font-size: 1.2rem;
  color: #4a6fa5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .d-flex.flex-wrap.gap-3 {
    flex-direction: column;
  }
  
  .d-flex.flex-wrap.gap-3 .v-btn {
    width: 100%;
  }
}
</style>
