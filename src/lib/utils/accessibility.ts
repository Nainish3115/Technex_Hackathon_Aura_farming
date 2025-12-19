// src/lib/utils/accessibility.ts
export class AccessibilityManager {
    private static instance: AccessibilityManager
    private preferences: AccessibilityPreferences = {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReader: false,
      voiceGuidance: true
    }
    private voiceGuidance: VoiceGuidance | null = null
  
    static getInstance(): AccessibilityManager {
      if (!AccessibilityManager.instance) {
        AccessibilityManager.instance = new AccessibilityManager()
      }
      return AccessibilityManager.instance
    }
  
    initialize(): void {
      // Detect user preferences
      this.detectSystemPreferences()
  
      // Set up accessibility features
      this.setupKeyboardNavigation()
      this.setupScreenReaderSupport()
      this.setupVoiceGuidance()
  
      // Apply initial preferences
      this.applyPreferences()
    }
  
    private detectSystemPreferences(): void {
      if (typeof window === 'undefined') return
  
      // Detect reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      this.preferences.reducedMotion = prefersReducedMotion.matches
  
      prefersReducedMotion.addEventListener('change', (e) => {
        this.preferences.reducedMotion = e.matches
        this.applyPreferences()
      })
  
      // Detect high contrast preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
      this.preferences.highContrast = prefersHighContrast.matches
  
      prefersHighContrast.addEventListener('change', (e) => {
        this.preferences.highContrast = e.matches
        this.applyPreferences()
      })
  
      // Detect screen reader
      // Note: This is not 100% reliable but provides a good indication
      const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                             window.navigator.userAgent.includes('JAWS') ||
                             window.navigator.userAgent.includes('VoiceOver')
      this.preferences.screenReader = hasScreenReader
    }
  
    private setupKeyboardNavigation(): void {
      if (typeof window === 'undefined') return
  
      // Ensure all interactive elements are keyboard accessible
      document.addEventListener('keydown', (event) => {
        // Handle Escape key for modal dialogs
        if (event.key === 'Escape') {
          this.handleEscapeKey()
        }
  
        // Handle Tab navigation
        if (event.key === 'Tab') {
          this.ensureFocusVisibility(event)
        }
      })
    }
  
    private setupScreenReaderSupport(): void {
      if (typeof window === 'undefined') return
  
      // Add ARIA labels and descriptions where needed
      this.addAriaLabels()
  
      // Announce dynamic content changes
      this.setupLiveRegions()
    }
  
    private setupVoiceGuidance(): void {
      if (!this.preferences.voiceGuidance) return
  
      // Setup voice announcements for important actions
      this.voiceGuidance = {
        announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
          if (this.preferences.screenReader) {
            this.announceToScreenReader(message, priority)
          } else {
            // Fallback to speech synthesis for voice guidance
            this.speakText(message)
          }
        }
      }
    }
  
    private addAriaLabels(): void {
      // Add ARIA labels to interactive elements that might be missing them
      const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])')
      buttons.forEach(button => {
        if (!button.textContent?.trim() && !button.querySelector('svg, img')) {
          button.setAttribute('aria-label', 'Button')
        }
      })
  
      // Add ARIA labels to voice controls
      const voiceButtons = document.querySelectorAll('[data-voice-control]')
      voiceButtons.forEach(button => {
        const action = button.getAttribute('data-voice-action')
        if (action) {
          button.setAttribute('aria-label', `${action} voice control`)
        }
      })
    }
  
    private setupLiveRegions(): void {
      // Create a live region for dynamic announcements
      if (!document.getElementById('accessibility-live-region')) {
        const liveRegion = document.createElement('div')
        liveRegion.id = 'accessibility-live-region'
        liveRegion.setAttribute('aria-live', 'polite')
        liveRegion.setAttribute('aria-atomic', 'true')
        liveRegion.style.position = 'absolute'
        liveRegion.style.left = '-10000px'
        liveRegion.style.width = '1px'
        liveRegion.style.height = '1px'
        liveRegion.style.overflow = 'hidden'
        document.body.appendChild(liveRegion)
      }
    }
  
    private handleEscapeKey(): void {
      // Close modals, dialogs, or cancel operations
      const openDialog = document.querySelector('[role="dialog"][aria-hidden="false"]') as HTMLElement
      if (openDialog) {
        const closeButton = openDialog.querySelector('[data-close]') as HTMLElement
        if (closeButton) {
          closeButton.click()
        }
      }
    }
  
    private ensureFocusVisibility(event: KeyboardEvent): void {
      // Ensure focus is visible for keyboard navigation
      setTimeout(() => {
        const focusedElement = document.activeElement as HTMLElement
        if (focusedElement) {
          focusedElement.style.outline = '2px solid #007bff'
          focusedElement.style.outlineOffset = '2px'
        }
      }, 0)
    }
  
    private announceToScreenReader(message: string, priority: 'polite' | 'assertive'): void {
      const liveRegion = document.getElementById('accessibility-live-region')
      if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority)
        liveRegion.textContent = message
  
        // Clear after announcement
        setTimeout(() => {
          liveRegion.textContent = ''
        }, 1000)
      }
    }
  
    private speakText(text: string): void {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8 // Slightly slower for clarity
        utterance.pitch = 1
        utterance.volume = 0.7
  
        // Use a clear, friendly voice if available
        const voices = speechSynthesis.getVoices()
        const preferredVoice = voices.find(voice =>
          voice.name.includes('Female') || voice.name.includes('Karen') || voice.lang.startsWith('en')
        )
        if (preferredVoice) {
          utterance.voice = preferredVoice
        }
  
        speechSynthesis.speak(utterance)
      }
    }
  
    // Public API methods
    setPreference(key: keyof AccessibilityPreferences, value: boolean): void {
      this.preferences[key] = value
      this.applyPreferences()
    }
  
    getPreferences(): AccessibilityPreferences {
      return { ...this.preferences }
    }
  
    announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
      this.voiceGuidance?.announce(message, priority)
    }
  
    private applyPreferences(): void {
      const root = document.documentElement
  
      // Apply reduced motion
      if (this.preferences.reducedMotion) {
        root.style.setProperty('--animation-duration', '0s')
      } else {
        root.style.removeProperty('--animation-duration')
      }
  
      // Apply high contrast
      if (this.preferences.highContrast) {
        root.classList.add('high-contrast')
      } else {
        root.classList.remove('high-contrast')
      }
  
      // Apply large text
      if (this.preferences.largeText) {
        root.classList.add('large-text')
      } else {
        root.classList.remove('large-text')
      }
    }
  
    // Elderly-friendly defaults
    setElderlyFriendlyMode(enabled: boolean): void {
      if (enabled) {
        this.setPreference('largeText', true)
        this.setPreference('voiceGuidance', true)
        this.setPreference('reducedMotion', false) // Some motion can be helpful
  
        // Apply elderly-friendly CSS class
        document.documentElement.classList.add('elderly-mode')
      } else {
        document.documentElement.classList.remove('elderly-mode')
      }
    }
  
    // Emergency accessibility features
    enableEmergencyMode(): void {
      // Large, high-contrast buttons for emergency situations
      this.setPreference('highContrast', true)
      this.setPreference('largeText', true)
      this.announce('Emergency mode activated. Large buttons enabled.', 'assertive')
  
      document.documentElement.classList.add('emergency-mode')
    }
  
    disableEmergencyMode(): void {
      document.documentElement.classList.remove('emergency-mode')
      this.announce('Emergency mode deactivated.', 'polite')
    }
  }
  
  export interface AccessibilityPreferences {
    reducedMotion: boolean
    highContrast: boolean
    largeText: boolean
    screenReader: boolean
    voiceGuidance: boolean
  }
  
  interface VoiceGuidance {
    announce: (message: string, priority?: 'polite' | 'assertive') => void
  }
  
  // Global accessibility manager instance
  export const accessibilityManager = AccessibilityManager.getInstance()