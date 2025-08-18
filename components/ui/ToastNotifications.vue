<template>
  <div class="toast-container">
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-list"
    >
      <div
        v-for="notification in activeNotifications"
        :key="notification.id"
        :class="[
          'toast',
          `toast--${notification.type}`,
          { 'toast--persistent': notification.persistent }
        ]"
        @click="showNotificationModal(notification)"
      >
        <!-- Toast Icon -->
        <div class="toast__icon">
          <v-icon :color="getIconColor(notification.type)">
            {{ getIcon(notification.type) }}
          </v-icon>
        </div>

        <!-- Toast Content -->
        <div class="toast__content">
          <div class="toast__title">{{ notification.title }}</div>
          <div v-if="notification.message" class="toast__message">
            {{ notification.message }}
          </div>
        </div>

        <!-- Toast Actions -->
        <div class="toast__actions">
          <v-btn
            v-if="notification.actions && notification.actions.length > 0"
            icon="mdi-dots-horizontal"
            variant="text"
            size="small"
            @click.stop="showNotificationModal(notification)"
          />
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click.stop="removeNotification(notification.id)"
          />
        </div>

        <!-- Progress Bar for non-persistent notifications -->
        <div
          v-if="!notification.persistent && notification.duration"
          class="toast__progress"
          :style="{ animationDuration: `${notification.duration}ms` }"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/ui/useNotifications';
import type { Notification } from '~/composables/ui/useNotifications';

const { 
  activeNotifications, 
  removeNotification, 
  showNotificationModal 
} = useNotifications();

// Get appropriate icon for notification type
const getIcon = (type: Notification['type']) => {
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
const getIconColor = (type: Notification['type']) => {
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
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.toast--success {
  border-left-color: #4caf50;
}

.toast--error {
  border-left-color: #f44336;
}

.toast--warning {
  border-left-color: #ff9800;
}

.toast--info {
  border-left-color: #2196f3;
}

.toast--persistent {
  border-left-width: 6px;
}

.toast__icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast__content {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  margin-bottom: 4px;
}

.toast__message {
  font-size: 13px;
  line-height: 1.4;
  color: #666;
}

.toast__actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  animation: progress-shrink linear forwards;
}

.toast--error .toast__progress {
  background: linear-gradient(90deg, #f44336, #ff5722);
}

.toast--warning .toast__progress {
  background: linear-gradient(90deg, #ff9800, #ffc107);
}

.toast--info .toast__progress {
  background: linear-gradient(90deg, #2196f3, #03a9f4);
}

@keyframes progress-shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .toast-list {
    max-width: none;
  }
  
  .toast {
    padding: 12px;
  }
}
</style>
