<template>
  <v-dialog v-model="isOpen" max-width="500px" persistent>
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center">
        <v-icon 
          :color="getIconColor(currentNotification?.type)" 
          class="me-3"
          size="large"
        >
          {{ getIcon(currentNotification?.type) }}
        </v-icon>
        <span class="text-h6">{{ currentNotification?.title }}</span>
      </v-card-title>

      <!-- Content -->
      <v-card-text v-if="currentNotification?.message" class="pt-4">
        <p class="text-body-1">{{ currentNotification.message }}</p>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions v-if="currentNotification?.actions && currentNotification.actions.length > 0" class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          v-for="action in currentNotification.actions"
          :key="action.label"
          :variant="action.variant || 'outlined'"
          :color="action.color || 'primary'"
          @click="handleAction(action)"
        >
          {{ action.label }}
        </v-btn>
      </v-card-actions>

      <!-- Footer -->
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          variant="text"
          @click="closeModal"
        >
          Close
        </v-btn>
        <v-btn
          v-if="currentNotification?.persistent"
          color="primary"
          variant="elevated"
          @click="dismissNotification"
        >
          Dismiss
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotifications } from '~/composables/ui/useNotifications';
import type { Notification, NotificationAction } from '~/composables/ui/useNotifications';

const { 
  isNotificationOpen, 
  currentNotification, 
  closeNotificationModal, 
  dismissNotification 
} = useNotifications();

// Computed property for v-model binding
const isOpen = computed({
  get: () => isNotificationOpen.value,
  set: (value: boolean) => {
    if (!value) {
      closeNotificationModal();
    }
  }
});

// Get appropriate icon for notification type
const getIcon = (type?: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    default:
      return 'mdi-bell';
  }
};

// Get appropriate color for notification type
const getIconColor = (type?: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'primary';
  }
};

// Handle action button clicks
const handleAction = (action: NotificationAction) => {
  try {
    action.action();
    closeModal();
  } catch (error) {
    console.error('Error executing notification action:', error);
  }
};

// Close modal
const closeModal = () => {
  closeNotificationModal();
};

// Dismiss notification
const dismissNotificationAction = () => {
  if (currentNotification.value) {
    dismissNotification(currentNotification.value.id);
  }
};
</script>
