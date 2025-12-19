// src/components/providers/SupabaseProvider.tsx
'use client'

import React, { createContext, useContext } from 'react'
import { supabase } from '../../lib/supabase/client'

// Create a context for Supabase client
const SupabaseContext = createContext<typeof supabase | null>(null)

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}