// src/lib/supabase/database.ts
import { supabase } from './client'
import type { CompanionConfig } from '../../types/companion'
import type { ConversationMessage, ConversationSession } from '../../types/conversation'

// Companion operations
export const createCompanion = async (config: Omit<CompanionConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('ai_companions')
    .insert(config)
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserCompanions = async (userId: string) => {
  const { data, error } = await supabase
    .from('ai_companions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const updateCompanion = async (id: string, updates: Partial<CompanionConfig>) => {
  const { data, error } = await supabase
    .from('ai_companions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Conversation operations
export const saveConversationMessage = async (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      ...message,
      timestamp: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getConversationHistory = async (userId: string, companionId: string, limit = 20) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('companion_id', companionId)
    .order('timestamp', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data.reverse() // Return in chronological order
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}