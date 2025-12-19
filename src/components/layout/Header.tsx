'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSupabaseAuth } from '../../lib/hooks/useSupabaseAuth'
import { Button } from '../ui/Button'

// Extend Window interface for Google Translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate: {
        TranslateElement: {
          InlineLayout: {
            SIMPLE: any
          }
          new (config: any, elementId: string): any
        }
      }
    }
  }
}

export const Header: React.FC = () => {
  const { user, logout } = useSupabaseAuth()
  const [isTranslateOpen, setIsTranslateOpen] = useState(false)

  // Load Google Translate script
  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.head.appendChild(script)

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,te,mr,ta,gu,ur,kn,ml,pa,or,as,mai,fr,es',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        )
      }
    }

    return () => {
      // Cleanup
      const translateElement = document.getElementById('google_translate_element')
      if (translateElement) {
        translateElement.innerHTML = ''
      }
    }
  }, [])

  const toggleTranslate = () => {
    setIsTranslateOpen(!isTranslateOpen)
    const translateElement = document.getElementById('google_translate_element')
    if (translateElement) {
      translateElement.style.display = isTranslateOpen ? 'none' : 'block'
    }
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b-4 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Even larger size */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/aashray_logo.png"
                alt="Aashray AI Logo"
                width={180}
                height={120}
                className="rounded-lg"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/companion"
                className="text-amber-700 hover:text-amber-600 px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-amber-50"
              >
                Aashray AI
              </Link>
              <Link
                href="/health"
                className="text-amber-700 hover:text-amber-600 px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-amber-50"
              >
                Health
              </Link>
              <Link
                href="/family"
                className="text-amber-700 hover:text-amber-600 px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-amber-50"
              >
                Family
              </Link>
              <Link
                href="/profile"
                className="text-amber-700 hover:text-amber-600 px-4 py-2 rounded-lg text-lg font-medium transition-colors hover:bg-amber-50"
              >
                Profile
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-lg text-amber-800 font-medium">
                    Welcome, {user.firstName || user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-amber-600 text-amber-700 hover:bg-amber-50 text-lg px-6 py-2"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth/signin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-600 text-amber-700 hover:bg-amber-50 text-lg px-6 py-2"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-6 py-2"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Google Translate Button - Fixed Position */}
      <button
        onClick={toggleTranslate}
        className="fixed top-6 right-6 bg-white border border-gray-300 hover:border-amber-400 text-amber-700 p-2 rounded-lg shadow-sm transition-all duration-200 z-50"
        title="Translate Website"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m5 8 6 6"/>
          <path d="m4 14 6-6 2-3"/>
          <path d="M2 5h12"/>
          <path d="M7 2h1"/>
          <path d="m22 22-5-10-5 10"/>
          <path d="M14 18h6"/>
        </svg>
      </button>

      {/* Google Translate Element - Smaller Size */}
      <div
        id="google_translate_element"
        className="fixed top-16 right-6 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 max-w-xs"
        style={{ display: 'none' }}
      ></div>
    </>
  )
}