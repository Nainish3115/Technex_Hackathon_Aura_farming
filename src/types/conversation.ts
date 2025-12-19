import { CompanionConfig } from "./companion"

export interface ConversationMessage {
    id: string
    userId: string
    companionId: string
    sessionId: string
    messageType: 'user' | 'ai'
    content: string
    audioUrl?: string
    emotionDetected?: string
    timestamp: string
  }
  
  export interface ConversationSession {
    id: string
    userId: string
    companion: CompanionConfig
    sessionId: string
    messages: ConversationMessage[]
    createdAt?: string
    updatedAt?: string
  }

  export interface ConversationSummary {
    id: string
    userId: string
    companionId: string
    sessionId: string
    summary: string
    createdAt?: string
    updatedAt?: string
  }