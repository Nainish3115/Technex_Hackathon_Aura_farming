'use client'

import { useState, useEffect, useCallback } from 'react'
import { getUserCompanions, createCompanion, updateCompanion } from '../supabase/database'
import type { CompanionConfig } from '../../types/companion'

export const useCompanionContext = (userId?: string) => {
  const [companions, setCompanions] = useState<CompanionConfig[]>([])
  const [activeCompanion, setActiveCompanion] = useState<CompanionConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user's companions
  const loadCompanions = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      setError(null)
      
      const userCompanions = await getUserCompanions(userId)
      setCompanions(userCompanions)

      // Set first active companion as default, or create one if none exist
      const activeComp = userCompanions.find(c => c.isActive) || userCompanions[0]
      if (activeComp) {
        setActiveCompanion(activeComp)
      } else if (userCompanions.length === 0) {
        // Create default companion
        await createDefaultCompanion()
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companions')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Create default companion for new users
  const createDefaultCompanion = useCallback(async () => {
    if (!userId) return

    try {
      const defaultCompanion = await createCompanion({
        companionName: "My Companion",
        personalityTraits: {
          friendly: 0.8,
          supportive: 0.9,
          cheerful: 0.7,
          empathetic: 0.8,
          calm: 0.6,
        },
        avatarStyle: 'calm',
        conversationTone: 'friendly',
        isActive: true,
      })

      setCompanions([defaultCompanion])
      setActiveCompanion(defaultCompanion)
    } catch (err) {
      setError('Failed to create default companion')
    }
  }, [userId])

  // Switch active companion
  const switchCompanion = useCallback(async (companionId: string) => {
    try {
      // Update all companions to inactive
      const updates = companions.map(comp => 
        updateCompanion(comp.id, { isActive: comp.id === companionId })
      )
      
      await Promise.all(updates)
      
      // Reload companions
      await loadCompanions()
    } catch (err) {
      setError('Failed to switch companion')
    }
  }, [companions, loadCompanions])

  // Update companion settings
  const updateCompanionSettings = useCallback(async (
    companionId: string, 
    updates: Partial<CompanionConfig>
  ) => {
    try {
      const updatedCompanion = await updateCompanion(companionId, updates)
      
      setCompanions(prev => 
        prev.map(comp => comp.id === companionId ? updatedCompanion : comp)
      )
      
      if (activeCompanion?.id === companionId) {
        setActiveCompanion(updatedCompanion)
      }
    } catch (err) {
      setError('Failed to update companion')
    }
  }, [activeCompanion])

  // Create new companion
  const createNewCompanion = useCallback(async (config: Omit<CompanionConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!userId) return

    try {
      const newCompanion = await createCompanion(config);

      setCompanions(prev => [...prev, newCompanion]);
      return newCompanion;
    } catch (err) {
      setError('Failed to create companion')
      throw err
    }
  }, [userId])

  // Load companions on mount
  useEffect(() => {
    loadCompanions()
  }, [loadCompanions])

  return {
    companions,
    activeCompanion,
    loading,
    error,
    switchCompanion,
    updateCompanionSettings,
    createNewCompanion,
    refreshCompanions: loadCompanions,
  }
}