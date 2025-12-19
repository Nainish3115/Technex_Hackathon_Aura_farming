'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { RealtimeVoiceClient } from '../openai/realtime-client'
import type { VoiceSession } from '../../types/voice'

export const useVoiceSession = (userId?: string) => {
  const voiceClientRef = useRef<RealtimeVoiceClient | null>(null)
  const [sessionState, setSessionState] = useState<VoiceSession>({
    isConnected: false,
    isConnecting: false,
    isListening: false,
    isSpeaking: false,
    audioLevel: 0,
    status: "Ready to connect"
  })
  const [audioData, setAudioData] = useState<Float32Array | null>(null)

  // Handle voice client state changes
  const handleStateChange = useCallback((state: any) => {
    setSessionState(prev => ({
      ...prev,
      ...state
    }))
  }, [])

  // Handle audio data for lip-sync
  const handleAudioData = useCallback((data: Float32Array) => {
    setAudioData(data)
  }, [])

  // Handle errors
  const handleError = useCallback((error: Error) => {
    console.error('Voice session error:', error)
    setSessionState(prev => ({
      ...prev,
      status: `Error: ${error.message}`,
      isConnected: false,
      isConnecting: false,
    }))
  }, [])

  const connect = useCallback(async () => {
    if (!userId) {
      handleError(new Error('User not authenticated'))
      return
    }

    try {
      setSessionState(prev => ({
        ...prev,
        isConnecting: true,
        status: "Getting session token..."
      }))

      // Get OpenAI session token from API
      const response = await fetch('/api/openai-session')
      if (!response.ok) {
        throw new Error('Failed to get session token')
      }

      const { token } = await response.json()

      setSessionState(prev => ({
        ...prev,
        status: "Initializing voice client..."
      }))

      // Initialize voice client
      voiceClientRef.current = new RealtimeVoiceClient(
        handleAudioData,
        handleStateChange,
        handleError
      )

      setSessionState(prev => ({
        ...prev,
        status: "Connecting to AI companion..."
      }))

      // Connect to OpenAI
      await voiceClientRef.current.connect(token)

    } catch (error) {
      handleError(error as Error)
    }
  }, [userId, handleAudioData, handleStateChange, handleError])

  const disconnect = useCallback(async () => {
    try {
      setSessionState(prev => ({
        ...prev,
        status: "Disconnecting..."
      }))

      if (voiceClientRef.current) {
        await voiceClientRef.current.disconnect()
        voiceClientRef.current = null
      }

      setSessionState({
        isConnected: false,
        isConnecting: false,
        isListening: false,
        isSpeaking: false,
        audioLevel: 0,
        status: "Disconnected"
      })

    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (voiceClientRef.current) {
        voiceClientRef.current.disconnect()
      }
    }
  }, [])

  return {
    sessionState,
    audioData,
    connect,
    disconnect,
  }
}