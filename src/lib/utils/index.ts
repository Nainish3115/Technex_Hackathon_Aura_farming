// Utility functions for the AI Companion app

export const cn = (...classes: (string | undefined | null | boolean)[]) => {
    return classes.filter(Boolean).join(' ')
  }
  
  export const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }
  
  export const formatTime = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }
  
  export const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  export const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
  
  export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }
  
  export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
  
  // Audio utilities
  export const formatAudioDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Validation utilities
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }
  
  // Accessibility utilities
  export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    
    announcement.textContent = message
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  // Storage utilities
  export const safeLocalStorage = {
    get: (key: string, defaultValue: any = null) => {
      if (typeof window === 'undefined') return defaultValue
      try {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
      } catch {
        return defaultValue
      }
    },
    
    set: (key: string, value: any) => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // Ignore storage errors
      }
    },
    
    remove: (key: string) => {
      if (typeof window === 'undefined') return
      try {
        window.localStorage.removeItem(key)
      } catch {
        // Ignore storage errors
      }
    }
  }
  
  // API utilities
  export const apiRequest = async (
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<any> => {
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  
    const response = await fetch(endpoint, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
  
    return response.json()
  }
  
  export const handleApiError = (error: any): string => {
    if (error instanceof Error) {
      return error.message
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    return 'An unexpected error occurred'
  }