'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '../../lib/hooks/useSupabaseAuth'
import { Loading } from '../ui/Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/signin',
  requireAuth = true
}) => {
  const { user, loading } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        // If user is authenticated but trying to access auth pages, redirect to companion
        router.push('/companion')
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Checking authentication..." />
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Will redirect
  }

  if (!requireAuth && user) {
    return null // Will redirect
  }

  return <>{children}</>
}