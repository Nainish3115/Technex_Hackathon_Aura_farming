'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSupabaseAuth } from '../../lib/hooks/useSupabaseAuth'
import { RealtimeVoiceClient } from '../../lib/openai/realtime-client'

interface VoiceSessionState {
  isConnected: boolean
  isConnecting: boolean
  isListening: boolean
  isSpeaking: boolean
  audioLevel: number
  status: string
  sessionId?: string
  audioData?: Float32Array
}

type VoiceSessionAction =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; sessionId: string }
  | { type: 'CONNECT_ERROR'; error: string }
  | { type: 'DISCONNECT' }
  | { type: 'LISTENING_START' }
  | { type: 'LISTENING_END' }
  | { type: 'SPEAKING_START' }
  | { type: 'SPEAKING_END' }
  | { type: 'AUDIO_LEVEL_UPDATE'; level: number; data?: Float32Array }
  | { type: 'STATUS_UPDATE'; status: string }

const initialState: VoiceSessionState = {
  isConnected: false,
  isConnecting: false,
  isListening: false,
  isSpeaking: false,
  audioLevel: 0,
  status: 'Ready to connect'
}

function voiceSessionReducer(state: VoiceSessionState, action: VoiceSessionAction): VoiceSessionState {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, isConnecting: true, status: 'Connecting...' }
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        sessionId: action.sessionId,
        status: 'Connected'
      }
    case 'CONNECT_ERROR':
      return {
        ...state,
        isConnected: false,
        isConnecting: false,
        status: `Error: ${action.error}`
      }
    case 'DISCONNECT':
      return {
        ...initialState,
        status: 'Disconnected'
      }
    case 'LISTENING_START':
      return { ...state, isListening: true }
    case 'LISTENING_END':
      return { ...state, isListening: false }
    case 'SPEAKING_START':
      return { ...state, isSpeaking: true }
    case 'SPEAKING_END':
      return { ...state, isSpeaking: false }
    case 'AUDIO_LEVEL_UPDATE':
      return {
        ...state,
        audioLevel: action.level,
        audioData: action.data
      }
    case 'STATUS_UPDATE':
      return { ...state, status: action.status }
    default:
      return state
  }
}

interface VoiceSessionContextType {
  state: VoiceSessionState
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  sendMessage: (text: string) => void
}

const VoiceSessionContext = createContext<VoiceSessionContextType | null>(null)

export const useVoiceSessionContext = () => {
  const context = useContext(VoiceSessionContext)
  if (!context) {
    throw new Error('useVoiceSessionContext must be used within VoiceSessionProvider')
  }
  return context
}

export const VoiceSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(voiceSessionReducer, initialState)
  const { user } = useSupabaseAuth()
  const voiceClientRef = React.useRef<RealtimeVoiceClient | null>(null)

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      handleDisconnect()
    }
  }, [user])

  const handleStateChange = React.useCallback((update: any) => {
    if (update.isSpeaking !== undefined) {
      dispatch({ type: update.isSpeaking ? 'SPEAKING_START' : 'SPEAKING_END' })
    }
    if (update.isListening !== undefined) {
      dispatch({ type: update.isListening ? 'LISTENING_START' : 'LISTENING_END' })
    }
    if (update.audioLevel !== undefined) {
      dispatch({
        type: 'AUDIO_LEVEL_UPDATE',
        level: update.audioLevel,
        data: update.audioData
      })
    }
    if (update.status) {
      dispatch({ type: 'STATUS_UPDATE', status: update.status })
    }
  }, [])

  const handleAudioData = React.useCallback((data: Float32Array) => {
    dispatch({ type: 'AUDIO_LEVEL_UPDATE', level: 0, data })
  }, [])

  const handleError = React.useCallback((error: Error) => {
    dispatch({ type: 'CONNECT_ERROR', error: error.message })
  }, [])

  const connect = React.useCallback(async () => {
    if (!user) {
      handleError(new Error('User not authenticated'))
      return
    }

    try {
      dispatch({ type: 'CONNECT_START' })

      // Get OpenAI session token
      const response = await fetch('/api/openai-session')
      if (!response.ok) {
        throw new Error('Failed to get session token')
      }

      const { token } = await response.json()

      // Initialize voice client
      voiceClientRef.current = new RealtimeVoiceClient(
        handleAudioData,
        handleStateChange,
        handleError
      )

      // Connect
      await voiceClientRef.current.connect(token)

      const sessionId = `session_${Date.now()}`
      dispatch({ type: 'CONNECT_SUCCESS', sessionId })

    } catch (error) {
      handleError(error as Error)
    }
  }, [user, handleAudioData, handleStateChange, handleError])

  const handleDisconnect = React.useCallback(async () => {
    if (voiceClientRef.current) {
      await voiceClientRef.current.disconnect()
      voiceClientRef.current = null
    }
    dispatch({ type: 'DISCONNECT' })
  }, [])

  const sendMessage = React.useCallback((text: string) => {
    if (voiceClientRef.current && state.isConnected) {
      voiceClientRef.current.sendText(text)
    }
  }, [state.isConnected])

  const contextValue = React.useMemo(() => ({
    state,
    connect,
    disconnect: handleDisconnect,
    sendMessage
  }), [state, connect, handleDisconnect, sendMessage])

  return (
    <VoiceSessionContext.Provider value={contextValue}>
      {children}
    </VoiceSessionContext.Provider>
  )
}