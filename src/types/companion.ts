export interface CompanionConfig {
    id: string
    userId: string
    companionName: string
    voiceId?: string
    personalityTraits: {
      friendly: number
      supportive: number
      cheerful: number
      empathetic: number
      calm: number
    }
    avatarStyle: 'calm' | 'expressive' | 'neutral'
    conversationTone: 'friendly' | 'supportive' | 'cheerful' | 'calm'
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  
  export interface CompanionState {
    config: CompanionConfig | null
    isConnected: boolean
    isSpeaking: boolean
    isListening: boolean
    audioLevel: number
    status: string
  }