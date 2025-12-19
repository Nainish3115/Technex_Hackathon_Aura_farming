// src/types/voice.ts
export interface VoiceSession {
    isConnected: boolean
    isConnecting: boolean
    isListening: boolean
    isSpeaking: boolean
    audioLevel: number
    status: string
    sessionId?: string
    audioData?: Float32Array
  }
  
  export interface AudioData {
    level: number
    isSpeaking: boolean
    frequencyData: Float32Array
    frequencyBands: FrequencyBands
    pitch: number
    voiceType: VoiceType
    timestamp: number
  }
  
  export interface FrequencyBands {
    low: number  // Low frequencies (male voices)
    mid: number  // Mid frequencies (voice formants)
    high: number // High frequencies (sibilants)
  }
  
  export type VoiceType = 'silent' | 'male_deep' | 'male' | 'female' | 'female_high' | 'neutral'
  
  export interface VoiceConfig {
    voiceId?: string
    stability: number
    similarityBoost: number
    style: number
    useSpeakerBoost: boolean
  }