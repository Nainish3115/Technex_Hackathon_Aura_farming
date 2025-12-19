import { supabase } from '../supabase/client'
import type { ConversationMessage } from '../../types/conversation'

export class ConversationStorage {
    private userId: string
    private companionId: string
    private sessionId: string
  
    constructor(userId: string, companionId: string, sessionId: string) {
      this.userId = userId
      this.companionId = companionId
      this.sessionId = sessionId
    }
  
    async saveMessage(message: Omit<ConversationMessage, 'id' | 'userId' | 'companionId' | 'sessionId' | 'timestamp'>): Promise<void> {
      try {
        await supabase.from('conversations').insert({
          user_id: this.userId,
          companion_id: this.companionId,
          session_id: this.sessionId,
          message_type: message.messageType,
          content: message.content,
          audio_url: message.audioUrl,
          emotion_detected: message.emotionDetected,
          timestamp: new Date().toISOString()
        })
    } catch (error) {
      console.error('Failed to save conversation message:', error)
      // Continue without throwing - conversation should not break
    }
  }

  async getRecentMessages(limit = 20): Promise<ConversationMessage[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', this.userId)
        .eq('session_id', this.sessionId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data.reverse().map(msg => ({
        id: msg.id,
        userId: msg.user_id,
        companionId: msg.companion_id,
        sessionId: msg.session_id,
        messageType: msg.message_type,
        content: msg.content,
        audioUrl: msg.audio_url,
        emotionDetected: msg.emotion_detected,
        timestamp: msg.timestamp
      }))
    } catch (error) {
      console.error('Failed to get conversation messages:', error)
      return []
    }
  }

  async getConversationSummary(): Promise<{
    totalMessages: number
    userMessages: number
    aiMessages: number
    sessionDuration: number
    lastActivity: string
  }> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('message_type, timestamp')
        .eq('user_id', this.userId)
        .eq('session_id', this.sessionId)

      if (error) throw error

      const messages = data
      const totalMessages = messages.length
      const userMessages = messages.filter(m => m.message_type === 'user').length
      const aiMessages = messages.filter(m => m.message_type === 'ai').length
      
      if (messages.length === 0) {
        return {
          totalMessages: 0,
          userMessages: 0,
          aiMessages: 0,
          sessionDuration: 0,
          lastActivity: new Date().toISOString()
        }
      }

      const timestamps = messages.map(m => new Date(m.timestamp).getTime())
      const firstMessage = Math.min(...timestamps)
      const lastMessage = Math.max(...timestamps)
      const sessionDuration = lastMessage - firstMessage

      return {
        totalMessages,
        userMessages,
        aiMessages,
        sessionDuration,
        lastActivity: new Date(lastMessage).toISOString()
      }
    } catch (error) {
      console.error('Failed to get conversation summary:', error)
      return {
        totalMessages: 0,
        userMessages: 0,
        aiMessages: 0,
        sessionDuration: 0,
        lastActivity: new Date().toISOString()
      }
    }
  }

  async exportConversation(): Promise<ConversationMessage[]> {
    return this.getRecentMessages(1000) // Export all messages
  }

  async clearConversation(): Promise<void> {
    try {
      await supabase
        .from('conversations')
        .delete()
        .eq('user_id', this.userId)
        .eq('session_id', this.sessionId)
    } catch (error) {
      console.error('Failed to clear conversation:', error)
    }
  }

  // Search messages by content
  async searchMessages(query: string): Promise<ConversationMessage[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', this.userId)
        .ilike('content', `%${query}%`)
        .order('timestamp', { ascending: false })
        .limit(50)

      if (error) throw error

      return data.map(msg => ({
        id: msg.id,
        userId: msg.user_id,
        companionId: msg.companion_id,
        sessionId: msg.session_id,
        messageType: msg.message_type,
        content: msg.content,
        audioUrl: msg.audio_url,
        emotionDetected: msg.emotion_detected,
        timestamp: msg.timestamp
      }))
    } catch (error) {
      console.error('Failed to search messages:', error)
      return []
    }
  }
}