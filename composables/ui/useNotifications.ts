import { ref, computed, readonly } from 'vue';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  timestamp: number;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'text' | 'outlined' | 'elevated' | 'tonal' | 'plain';
  color?: string;
}

// Global state for notifications (shared across all instances)
const globalNotifications = ref<Notification[]>([]);
const globalIsNotificationOpen = ref(false);
const globalCurrentNotification = ref<Notification | null>(null);

export function useNotifications() {
  // Use global state
  const notifications = globalNotifications;
  const isNotificationOpen = globalIsNotificationOpen;
  const currentNotification = globalCurrentNotification;

  // Computed properties
  const hasNotifications = computed(() => notifications.value.length > 0);
  const activeNotifications = computed(() => 
    notifications.value.filter(n => !n.persistent || n.persistent)
  );

  // Generate unique ID for notifications
  const generateId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: generateId(),
      timestamp: Date.now(),
      duration: 5000, // Default 5 seconds
      persistent: false,
      ...notification
    };

    notifications.value.push(newNotification);

    // Auto-remove non-persistent notifications after duration
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }

    return newNotification.id;
  };

  // Remove a specific notification
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // Clear all notifications
  const clearNotifications = () => {
    notifications.value = [];
  };

  // Clear notifications by type
  const clearNotificationsByType = (type: Notification['type']) => {
    notifications.value = notifications.value.filter(n => n.type !== type);
  };

  // Success notification
  const showSuccess = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  };

  // Error notification
  const showError = (title: string, message?: string, options?: Partial<Notification>) => {
    console.log('showError called with:', title, message, options);
    return addNotification({
      type: 'error',
      title,
      message,
      persistent: true, // Errors are persistent by default
      ...options
    });
  };

  // Warning notification
  const showWarning = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  };

  // Info notification
  const showInfo = (title: string, message?: string, options?: Partial<Notification>) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  };

  // Show notification modal
  const showNotificationModal = (notification: Notification) => {
    currentNotification.value = notification;
    isNotificationOpen.value = true;
  };

  // Close notification modal
  const closeNotificationModal = () => {
    isNotificationOpen.value = false;
    currentNotification.value = null;
  };

  // Dismiss notification (remove and close modal if open)
  const dismissNotification = (id: string) => {
    removeNotification(id);
    if (currentNotification.value?.id === id) {
      closeNotificationModal();
    }
  };

  return {
    // State
    notifications: readonly(notifications),
    isNotificationOpen: readonly(isNotificationOpen),
    currentNotification: readonly(currentNotification),
    
    // Computed
    hasNotifications,
    activeNotifications,
    
    // Actions
    addNotification,
    removeNotification,
    clearNotifications,
    clearNotificationsByType,
    
    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Modal management
    showNotificationModal,
    closeNotificationModal,
    dismissNotification
  };
}
