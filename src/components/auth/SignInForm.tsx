'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '../../lib/hooks/useSupabaseAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader, CardFooter } from '../ui/Card'

export const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useSupabaseAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsLoading(true)
    try {
      await login(email, password)
      router.push('/companion')
    } catch (error) {
      console.error('Sign in error:', error)
      // Error handling would be done via global error handler
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-8">
      <div className="w-full max-w-md bg-white/95 rounded-lg border-4 border-amber-200 shadow-xl">
        <div className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h1 className="text-3xl font-bold text-amber-900 font-serif">Aashray AI</h1>
            </div>
            <h2 className="text-2xl font-semibold text-amber-900">Welcome Back</h2>
            <p className="text-amber-700 mt-2">Sign in to continue your conversations</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg bg-amber-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-lg bg-amber-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-amber-700">Remember me</span>
                </label>

                <Link
                  href="/auth/reset-password"
                  className="text-sm text-amber-600 hover:text-amber-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold py-3 px-4 rounded-lg text-lg transition-colors"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center mt-6">
              <span className="text-sm text-amber-700">Don't have an account? </span>
              <Link
                href="/auth/signup"
                className="text-sm text-amber-600 hover:text-amber-500 font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}