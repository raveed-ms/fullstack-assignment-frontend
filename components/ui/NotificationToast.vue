<template>
  <div class="notification-container">
    <TransitionGroup
      name="notification"
      tag="div"
      class="notification-list"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
      >
        <v-snackbar
          :model-value="true"
          :timeout="notification.persistent ? -1 : notification.duration"
          :color="getNotificationColor(notification.type)"
          location="top"
          class="notification-snackbar"
          @update:model-value="removeNotification(notification.id)"
        >
          <div class="notification-content">
            <div class="notification-header">
              <v-icon
                :icon="getNotificationIcon(notification.type)"
                :color="getNotificationColor(notification.type)"
                class="me-2"
              />
              <span v-if="notification.title" class="notification-title">
                {{ notification.title }}
              </span>
            </div>
            
            <div class="notification-message">
              {{ notification.message }}
            </div>
            
            <div v-if="notification.action" class="notification-actions">
              <v-btn
                :color="getNotificationColor(notification.type)"
                variant="text"
                size="small"
                @click="handleAction(notification)"
              >
                {{ notification.action.label }}
              </v-btn>
            </div>
          </div>
          
          <template v-slot:actions>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="removeNotification(notification.id)"
            />
          </template>
        </v-snackbar>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/composables/ui/useNotifications'

interface Props {
  notifications: Notification[]
}

interface Emits {
  (e: 'remove', id: string): void
  (e: 'action', notification: Notification): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Remove notification
const removeNotification = (id: string) => {
  emit('remove', id)
}

// Handle action button click
const handleAction = (notification: Notification) => {
  if (notification.action) {
    notification.action.handler()
  }
  emit('action', notification)
}

// Get notification color based on type
const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'success'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'primary'
  }
}

// Get notification icon based on type
const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info': return 'mdi-information'
    default: return 'mdi-bell'
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  pointer-events: auto;
}

.notification-item {
  min-width: 300px;
  max-width: 400px;
}

.notification-snackbar {
  pointer-events: auto;
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notification-header {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.notification-message {
  font-size: 0.875rem;
  line-height: 1.4;
  word-break: break-word;
}

.notification-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.25rem;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style> 