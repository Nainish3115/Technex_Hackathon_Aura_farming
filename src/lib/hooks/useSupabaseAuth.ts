"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabase/client"
import { getCurrentUser, signIn, signUp, signOut } from "../supabase/auth"
import type { User, AuthState } from "../../types/auth"

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const getInitialSession = async () => {
      try {
        const user = await getCurrentUser()

        if (!isMounted) return

        setAuthState({
          user: user ? (user as unknown as User) : null,
          loading: false,
          error: null,
        })
      } catch (err) {
        if (!isMounted) return

        setAuthState({
          user: null,
          loading: false,
          error: (err as Error).message,
        })
      }
    }

    getInitialSession()

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return

        setAuthState({
          user: session?.user ? (session.user as unknown as User) : null,
          loading: false,
          error: null,
        })
      }
    )

    return () => {
      isMounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      return await signIn(email, password)
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: (err as Error).message,
      }))
      throw err
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }))
    }
  }

  const register = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      return await signUp(email, password, userData)
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: (err as Error).message,
      }))
      throw err
    } finally {
      setAuthState((prev) => ({ ...prev, loading: false }))
    }
  }

  const logout = async () => {
    try {
      await signOut()
      setAuthState({
        user: null,
        loading: false,
        error: null,
      })
    } catch (err) {
      setAuthState((prev) => ({
        ...prev,
        error: (err as Error).message,
      }))
      throw err
    }
  }

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    register,
    logout,
  }
}
