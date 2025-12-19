'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { AvatarRenderer } from '../avatar/renderer'
import { AvatarAnimator } from '../avatar/animations'
import { MorphTargetController } from '../avatar/morph-targets'
import { LipSyncProcessor, type LipSyncData } from '../openai/lip-sync'
import type { AvatarState } from '../../types/avatar'

export const useAvatar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<AvatarRenderer | null>(null)
  const animatorRef = useRef<AvatarAnimator | null>(null)
  const morphControllerRef = useRef<MorphTargetController | null>(null)
  const lipSyncProcessorRef = useRef<LipSyncProcessor | null>(null)
  
  const [avatarState, setAvatarState] = useState<AvatarState>({
    isLoaded: false,
    isAnimating: false,
    currentAnimation: '',
    morphTargetValues: {} as Record<string, number>,
    currentExpression: 'neutral' as string,
  })

  // Initialize avatar system
  useEffect(() => {
    if (!canvasRef.current) return

    const initializeAvatar = async () => {
      try {
        // Create renderer
        rendererRef.current = new AvatarRenderer(canvasRef.current!)
        
        // Load avatar model
        await rendererRef.current.loadAvatar()
        
        // Initialize animator
        if (rendererRef.current.avatar) {
          // Note: This would need the mixer from the GLTF loader
          // animatorRef.current = new AvatarAnimator(mixer)
        }
        
        // Initialize morph controller
        if (rendererRef.current.avatar) {
          morphControllerRef.current = new MorphTargetController(rendererRef.current.avatar)
        }
        
        // Initialize lip-sync processor
        lipSyncProcessorRef.current = new LipSyncProcessor()
        
        // Start random blinking
        if (morphControllerRef.current) {
          morphControllerRef.current.startRandomBlinking()
        }
        
        setAvatarState(prev => ({ ...prev, isLoaded: true }))
        
        // Start render loop
        const animate = () => {
          if (rendererRef.current) {
            rendererRef.current.update(1/60) // 60fps
            rendererRef.current.render()
          }
          requestAnimationFrame(animate)
        }
        animate()
        
      } catch (error) {
        console.error('Failed to initialize avatar:', error)
      }
    }

    initializeAvatar()

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (lipSyncProcessorRef.current) {
        lipSyncProcessorRef.current.dispose()
      }
    }
  }, [])

  // Handle lip-sync data
  const handleLipSync = useCallback((lipSyncData: LipSyncData) => {
    if (morphControllerRef.current) {
      morphControllerRef.current.applyLipSync(lipSyncData)
    }
  }, [])

  // Play animation
  const playAnimation = useCallback((animationName: string) => {
    if (animatorRef.current) {
      const success = animatorRef.current.play(animationName)
      if (success) {
        setAvatarState(prev => ({ 
          ...prev, 
          isAnimating: true, 
          currentAnimation: animationName 
        }))
      }
    }
  }, [])

  // Set expression
  const setExpression = useCallback((expression: string) => {
    if (morphControllerRef.current) {
      morphControllerRef.current.setExpression(expression)
    }
  }, [])

  // Update morph target
  const updateMorphTarget = useCallback((targetName: string, value: number) => {
    if (morphControllerRef.current) {
      morphControllerRef.current.setMorphTarget(targetName, value)
    }
  }, [])

  // Handle speaking state
  const setSpeaking = useCallback((isSpeaking: boolean, audioData?: Float32Array) => {
    if (isSpeaking) {
      playAnimation('talking')
      // Start lip-sync processing
      if (lipSyncProcessorRef.current && audioData) {
        lipSyncProcessorRef.current.startProcessing(handleLipSync)
      }
    } else {
      playAnimation('idle')
      // Stop lip-sync processing
      if (lipSyncProcessorRef.current) {
        lipSyncProcessorRef.current.stopProcessing()
      }
    }
  }, [playAnimation, handleLipSync])

  // Handle listening state
  const setListening = useCallback((isListening: boolean) => {
    if (isListening) {
      playAnimation('listening')
      setExpression('neutral')
    } else {
      playAnimation('idle')
    }
  }, [playAnimation, setExpression])

  // Get canvas ref for component
  const getCanvasRef = useCallback(() => canvasRef, [])

  return {
    avatarState,
    getCanvasRef,
    playAnimation,
    setExpression,
    updateMorphTarget,
    setSpeaking,
    setListening,
  }
}