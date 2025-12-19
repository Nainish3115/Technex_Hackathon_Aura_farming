'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Correctly import the named export from Avatar3DScene
const Avatar3DScene = dynamic(() => import('./Avatar3DScene').then(mod => mod.Avatar3DScene), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden relative flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⟳</div>
        <div className="text-lg font-medium text-white">Loading 3D Avatar...</div>
      </div>
    </div>
  )
})

interface Avatar3DProps {
  isSpeaking: boolean
  isListening: boolean
  audioLevel: number
  onLipSyncData?: (data: any) => void
}

export const Avatar3D: React.FC<Avatar3DProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Only set mounted after a brief delay to ensure React is fully ready
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden relative flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <div className="text-lg font-medium text-white">Preparing 3D Avatar...</div>
        </div>
      </div>
    )
  }

  return <Avatar3DScene {...props} />
}