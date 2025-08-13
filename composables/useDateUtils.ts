export function useDateUtils() {
  // Format date to locale string
  const formatDate = (date: string | Date): string => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  // Format date with time
  const formatDateTime = (date: string | Date): string => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString()
  }

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (date: string | Date): string => {
    if (!date) return 'N/A'
    
    const now = new Date()
    const targetDate = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  // Check if date is today
  const isToday = (date: string | Date): boolean => {
    if (!date) return false
    const today = new Date()
    const targetDate = new Date(date)
    return today.toDateString() === targetDate.toDateString()
  }

  // Check if date is this week
  const isThisWeek = (date: string | Date): boolean => {
    if (!date) return false
    const today = new Date()
    const targetDate = new Date(date)
    const diffTime = Math.abs(today.getTime() - targetDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    isToday,
    isThisWeek
  }
} 