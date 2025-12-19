export class ErrorHandler {
    private static instance: ErrorHandler
    private errorLog: ErrorLog[] = []
    private maxLogSize = 100
  
    static getInstance(): ErrorHandler {
      if (!ErrorHandler.instance) {
        ErrorHandler.instance = new ErrorHandler()
      }
      return ErrorHandler.instance
    }
  
    logError(error: Error, context?: Record<string, any>): void {
      const errorEntry: ErrorLog = {
        id: Date.now().toString(),
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server'
      }
  
      this.errorLog.unshift(errorEntry)
      
      // Keep only recent errors
      if (this.errorLog.length > this.maxLogSize) {
        this.errorLog = this.errorLog.slice(0, this.maxLogSize)
      }
  
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorEntry)
      }
  
      // Send to error reporting service (if configured)
      this.reportError(errorEntry)
    }
  
    private async reportError(errorLog: ErrorLog): Promise<void> {
      // Implement error reporting to external service
      // e.g., Sentry, LogRocket, etc.
      
      try {
        // Example: Send to custom error endpoint
        if (process.env.NEXT_PUBLIC_ERROR_REPORTING_URL) {
          await fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorLog)
          })
        }
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError)
      }
    }
  
    getRecentErrors(limit = 10): ErrorLog[] {
      return this.errorLog.slice(0, limit)
    }
  
    clearErrorLog(): void {
      this.errorLog = []
    }
  
    // Specific error handlers for different subsystems
    handleVoiceError(error: Error, context: { sessionId?: string; userId?: string }): void {
      this.logError(error, { ...context, subsystem: 'voice' })
      
      // Voice-specific error handling
      if (error.message.includes('microphone')) {
        // Handle microphone permission errors
        this.showUserFriendlyError('Microphone access is required for voice conversations. Please check your browser permissions.')
      } else if (error.message.includes('network')) {
        // Handle network errors
        this.showUserFriendlyError('Connection lost. Please check your internet connection and try again.')
      }
    }
  
    handleAvatarError(error: Error, context: { modelUrl?: string }): void {
      this.logError(error, { ...context, subsystem: 'avatar' })
      
      // Avatar-specific error handling
      if (error.message.includes('model')) {
        this.showUserFriendlyError('Unable to load avatar. Please refresh the page.')
      }
    }
  
    handleAuthError(error: Error, context: { action?: string }): void {
      this.logError(error, { ...context, subsystem: 'auth' })
      
      // Auth-specific error handling
      if (error.message.includes('invalid_credentials')) {
        this.showUserFriendlyError('Invalid email or password. Please try again.')
      } else if (error.message.includes('network')) {
        this.showUserFriendlyError('Unable to connect. Please check your internet connection.')
      }
    }
  
    private showUserFriendlyError(message: string): void {
      // Show user-friendly error notification
      // This could integrate with a toast notification system
      if (typeof window !== 'undefined') {
        // Example: Use browser alert for now (replace with proper notification system)
        console.warn('User Error:', message)
        
        // Could dispatch to a global error state or notification system
        // window.dispatchEvent(new CustomEvent('app-error', { detail: { message } }))
      }
    }
  
    // Health check for critical systems
    async performHealthCheck(): Promise<HealthStatus> {
      const checks = {
        voice: await this.checkVoiceHealth(),
        avatar: await this.checkAvatarHealth(),
        database: await this.checkDatabaseHealth(),
        realtime: await this.checkRealtimeHealth()
      }
  
      const isHealthy = Object.values(checks).every(check => check.status === 'healthy')
      
      return {
        isHealthy,
        checks,
        timestamp: new Date().toISOString()
      }
    }
  
    private async checkVoiceHealth(): Promise<SystemHealth> {
      try {
        // Check if Web Audio API is available
        if (!window.AudioContext && !(window as any).webkitAudioContext) {
          return { status: 'unhealthy', message: 'Web Audio API not supported' }
        }
        
        // Try to create audio context
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        await audioContext.close()
        
        return { status: 'healthy' }
      } catch (error) {
        return { status: 'unhealthy', message: 'Audio context creation failed' }
      }
    }
  
    private async checkAvatarHealth(): Promise<SystemHealth> {
      try {
        // Check if WebGL is available
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (!gl) {
          return { status: 'unhealthy', message: 'WebGL not supported' }
        }
        
        return { status: 'healthy' }
      } catch (error) {
        return { status: 'unhealthy', message: 'WebGL check failed' }
      }
    }
  
    private async checkDatabaseHealth(): Promise<SystemHealth> {
      try {
        // Simple database connectivity check
        const response = await fetch('/api/health/database', { method: 'GET' })
        if (response.ok) {
          return { status: 'healthy' }
        } else {
          return { status: 'unhealthy', message: 'Database health check failed' }
        }
      } catch (error) {
        return { status: 'unhealthy', message: 'Database connection failed' }
      }
    }
  
    private async checkRealtimeHealth(): Promise<SystemHealth> {
      try {
        // Check WebSocket connectivity
        return { status: 'healthy' } // Placeholder
      } catch (error) {
        return { status: 'unhealthy', message: 'Real-time connection failed' }
      }
    }
  }
  
  export interface ErrorLog {
    id: string
    message: string
    stack?: string
    context?: Record<string, any>
    timestamp: string
    userAgent: string
    url: string
  }
  
  export interface HealthStatus {
    isHealthy: boolean
    checks: {
      voice: SystemHealth
      avatar: SystemHealth
      database: SystemHealth
      realtime: SystemHealth
    }
    timestamp: string
  }
  
  export interface SystemHealth {
    status: 'healthy' | 'unhealthy' | 'degraded'
    message?: string
  }
  
  // Global error handler instance
  export const errorHandler = ErrorHandler.getInstance()
  
  // Utility functions for common error handling
  export const handleAsyncError = (fn: () => Promise<void>) => {
    return async () => {
      try {
        await fn()
      } catch (error) {
        errorHandler.logError(error as Error)
      }
    }
  }
  
  export const withErrorBoundary = <T extends any[], R>(
    fn: (...args: T) => R,
    fallback?: R
  ) => {
    return (...args: T): R => {
      try {
        return fn(...args)
      } catch (error) {
        errorHandler.logError(error as Error)
        return fallback as R
      }
    }
  }