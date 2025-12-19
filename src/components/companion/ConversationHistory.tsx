// src/components/companion/ConversationHistory.tsx
'use client'

import React from 'react'
import { useConversationHistory } from '../../lib/hooks/useConversationHistory'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Loading } from '../ui/Loading'
import type { ConversationMessage } from '../../types/conversation'

interface ConversationHistoryProps {
  companionId?: string
  limit?: number
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  companionId,
  limit = 10
}) => {
  const { messages, loading, error, loadMore } = useConversationHistory(companionId, limit)

  if (loading && messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Conversation History</h3>
        </CardHeader>
        <CardContent>
          <Loading text="Loading conversation..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Conversation History</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            <p>Failed to load conversation history</p>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Conversation History</h3>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No conversation history yet</p>
            <p className="text-sm mt-1">Start a conversation to see messages here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message: ConversationMessage) => (
              <div
                key={message.id}
                className={`flex ${message.messageType === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.messageType === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`text-xs mt-1 ${
                    message.messageType === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                    {message.emotionDetected && (
                      <span className="ml-2">({message.emotionDetected})</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {messages.length >= limit && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more messages'}
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}