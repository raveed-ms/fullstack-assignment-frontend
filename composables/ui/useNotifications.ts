export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
  timestamp: number
}

export interface NotificationOptions {
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
}

export function useNotifications() {
  const { 
    currentNotifications, 
    addNotification: addStoreNotification,
    removeNotification: removeStoreNotification,
    clearNotifications: clearStoreNotifications
  } = useUiStore()
  
  const notifications = computed(() => currentNotifications.value)
  const maxNotifications = 5

  // Default durations for different notification types
  const defaultDurations = {
    success: 4000,
    error: 6000,
    warning: 5000,
    info: 3000
  }

  // Generate unique ID for notifications
  const generateId = (): string => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Add notification to queue
  const addNotification = (
    type: Notification['type'],
    message: string,
    title?: string,
    options: NotificationOptions = {}
  ): string => {
    const {
      duration = defaultDurations[type],
      persistent = false,
      action
    } = options

    addStoreNotification({
      type,
      title: title || '',
      message,
      duration: persistent ? 0 : duration
    })

    return generateId()
  }

  // Remove specific notification
  const removeNotification = (id: string): void => {
    removeStoreNotification(id)
  }

  // Clear all notifications
  const clearAllNotifications = (): void => {
    clearStoreNotifications()
  }

  // Clear notifications by type
  const clearNotificationsByType = (type: Notification['type']): void => {
    notifications.value = notifications.value.filter(n => n.type !== type)
  }

  // Convenience methods for different notification types
  const showSuccess = (message: string, title?: string, options?: NotificationOptions): string => {
    return addNotification('success', message, title, options)
  }

  const showError = (message: string, title?: string, options?: NotificationOptions): string => {
    return addNotification('error', message, title, options)
  }

  const showWarning = (message: string, title?: string, options?: NotificationOptions): string => {
    return addNotification('warning', message, title, options)
  }

  const showInfo = (message: string, title?: string, options?: NotificationOptions): string => {
    return addNotification('info', message, title, options)
  }

  // Show persistent notification (won't auto-dismiss)
  const showPersistent = (
    type: Notification['type'],
    message: string,
    title?: string,
    action?: { label: string; handler: () => void }
  ): string => {
    return addNotification(type, message, title, {
      persistent: true,
      action
    })
  }

  // Get notification count by type
  const getNotificationCount = (type?: Notification['type']): number => {
    if (type) {
      return notifications.value.filter(n => n.type === type).length
    }
    return notifications.value.length
  }

  // Check if there are any notifications
  const hasNotifications = computed(() => notifications.value.length > 0)

  // Get notifications by type
  const getNotificationsByType = (type: Notification['type']) => {
    return computed(() => notifications.value.filter(n => n.type === type))
  }

  // Get success notifications
  const successNotifications = getNotificationsByType('success')

  // Get error notifications
  const errorNotifications = getNotificationsByType('error')

  // Get warning notifications
  const warningNotifications = getNotificationsByType('warning')

  // Get info notifications
  const infoNotifications = getNotificationsByType('info')

  return {
    // State
    notifications: readonly(notifications),
    
    // Computed
    hasNotifications,
    successNotifications,
    errorNotifications,
    warningNotifications,
    infoNotifications,
    
    // Methods
    addNotification,
    removeNotification,
    clearAllNotifications,
    clearNotificationsByType,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent,
    getNotificationCount
  }
}