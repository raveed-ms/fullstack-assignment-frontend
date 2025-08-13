import { defineStore } from 'pinia'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: string
}

interface ModalState {
  id: string
  isOpen: boolean
  title?: string
  content?: string
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'text' | 'outlined' | 'elevated'
    color?: string
  }>
}

export const useUiStore = defineStore('ui', () => {
  // State
  const notifications = ref<Notification[]>([])
  const modals = ref<ModalState[]>([])
  const theme = ref<'light' | 'dark'>('light')
  const sidebarOpen = ref(false)
  const loadingOverlay = ref(false)

  // Getters
  const currentNotifications = computed(() => notifications.value)
  const hasNotifications = computed(() => notifications.value.length > 0)
  const currentModals = computed(() => modals.value.filter(m => m.isOpen))
  const hasOpenModals = computed(() => modals.value.some(m => m.isOpen))
  const isSidebarOpen = computed(() => sidebarOpen.value)
  const isDarkTheme = computed(() => theme.value === 'dark')

  // Actions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, notification.duration || 5000)
    }
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'success',
      title,
      message: message || title,
      duration
    })
  }

  const showError = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'error',
      title,
      message: message || title,
      duration
    })
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'warning',
      title,
      message: message || title,
      duration
    })
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    addNotification({
      type: 'info',
      title,
      message: message || title,
      duration
    })
  }

  const openModal = (modal: Omit<ModalState, 'id' | 'isOpen'>) => {
    const newModal: ModalState = {
      ...modal,
      id: Date.now().toString(),
      isOpen: true
    }
    modals.value.push(newModal)
  }

  const closeModal = (id: string) => {
    const modal = modals.value.find(m => m.id === id)
    if (modal) {
      modal.isOpen = false
    }
  }

  const closeAllModals = () => {
    modals.value.forEach(modal => {
      modal.isOpen = false
    })
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const openSidebar = () => {
    sidebarOpen.value = true
  }

  const closeSidebar = () => {
    sidebarOpen.value = false
  }

  const setLoadingOverlay = (loading: boolean) => {
    loadingOverlay.value = loading
  }

  return {
    // State
    notifications,
    modals,
    theme,
    sidebarOpen,
    loadingOverlay,
    
    // Getters
    currentNotifications,
    hasNotifications,
    currentModals,
    hasOpenModals,
    isSidebarOpen,
    isDarkTheme,
    
    // Actions
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    openModal,
    closeModal,
    closeAllModals,
    toggleTheme,
    setTheme,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setLoadingOverlay
  }
}) 