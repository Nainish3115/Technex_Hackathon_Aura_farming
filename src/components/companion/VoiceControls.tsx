'use client'

import React from 'react'
import { Button } from '../ui/Button'

interface VoiceControlsProps {
  isConnected: boolean
  isConnecting: boolean
  onConnect: () => void
  onDisconnect: () => void
  isListening?: boolean
  isSpeaking?: boolean
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  isListening = false,
  isSpeaking = false
}) => {
  const getStatusText = () => {
    if (isConnecting) return "Connecting..."
    if (isConnected) {
      if (isSpeaking) return "AI is speaking"
      if (isListening) return "Listening..."
      return "Connected - Ready to talk"
    }
    return "Click to start conversation"
  }

  const getStatusColor = () => {
    if (isConnecting) return "text-yellow-600"
    if (isConnected) {
      if (isSpeaking) return "text-blue-600"
      if (isListening) return "text-green-600"
      return "text-gray-600"
    }
    return "text-gray-500"
  }

  return (
    <div className="space-y-4">
      {/* Main Voice Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          variant={isConnected ? "secondary" : "primary"}
          isLoading={isConnecting}
          onClick={isConnected ? onDisconnect : onConnect}
          className="w-32 h-32 rounded-full text-lg font-semibold"
        >
          {isConnected ? (
            <div className="flex flex-col items-center space-y-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9l4-4m-4 4l-4-4" />
              </svg>
              <span>Stop</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>Start</span>
            </div>
          )}
        </Button>
      </div>

      {/* Status Display */}
      <div className="text-center">
        <p className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </p>
      </div>

      {/* Voice Indicators */}
      {(isListening || isSpeaking) && (
        <div className="flex justify-center space-x-4">
          {isListening && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Listening</span>
            </div>
          )}
          
          {isSpeaking && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Speaking</span>
            </div>
          )}
        </div>
      )}

      {/* Additional Controls */}
      {isConnected && (
        <div className="flex justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Implement mute functionality
              console.log('Mute clicked')
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            Mute
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              // Implement settings modal
              console.log('Settings clicked')
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Button>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {isConnected 
            ? "Speak naturally - the AI will respond automatically"
            : "Click start to begin your conversation"
          }
        </p>
      </div>
    </div>
  )
}