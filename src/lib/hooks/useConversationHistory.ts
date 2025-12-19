'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ConversationMessage } from '../../types/conversation'

export const useConversationHistory = (companionId?: string, initialLimit = 20) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const loadMessages = useCallback(async (limit = initialLimit, offset = 0) => {
    if (!companionId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/conversation-history?userId=${encodeURIComponent('current-user')}&companionId=${encodeURIComponent(companionId)}&limit=${limit}&offset=${offset}`
      )

      if (!response.ok) throw new Error('Failed to fetch messages')

      const data = await response.json()
      
      if (offset === 0) {
        setMessages(data.messages)
      } else {
        setMessages(prev => [...data.messages, ...prev])
      }
      
      setHasMore(data.messages.length === limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [companionId, initialLimit])

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMessages(initialLimit, messages.length)
    }
  }, [hasMore, loading, loadMessages, initialLimit, messages.length])

  const addMessage = useCallback(async (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    try {
      const response = await fetch('/api/conversation-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...message,
          userId: 'current-user' // This should come from auth context
        })
      })

      if (!response.ok) throw new Error('Failed to save message')

      const data = await response.json()
      
      // Add to local state immediately for better UX
      setMessages(prev => [...prev, {
        ...message,
        id: data.message.id,
        timestamp: data.message.timestamp
      }])
    } catch (err) {
      setError('Failed to save message')
      throw err
    }
  }, [])

  const clearHistory = useCallback(async () => {
    if (!companionId) return

    try {
      const response = await fetch(
        `/api/conversation-history?userId=${encodeURIComponent('current-user')}&companionId=${encodeURIComponent(companionId)}`,
        { method: 'DELETE' }
      )

      if (!response.ok) throw new Error('Failed to clear history')

      setMessages([])
      setHasMore(false)
    } catch (err) {
      setError('Failed to clear history')
      throw err
    }
  }, [companionId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore,
    addMessage,
    clearHistory,
    refresh: () => loadMessages()
  }
}