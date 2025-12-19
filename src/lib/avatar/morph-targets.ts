import * as THREE from 'three'
import { MORPH_TARGETS } from '../../constants/avatars'
import type { LipSyncData } from '../openai/lip-sync'

export class MorphTargetController {
  private avatar: THREE.Group
  private morphInfluences: Map<string, number> = new Map()
  private baseInfluences: Map<string, number> = new Map()

  constructor(avatar: THREE.Group) {
    this.avatar = avatar
    this.initializeMorphTargets()
  }

  private initializeMorphTargets(): void {
    // Initialize all morph targets to 0
    Object.keys(MORPH_TARGETS).forEach(targetName => {
      this.morphInfluences.set(targetName, 0)
      this.baseInfluences.set(targetName, 0)
    })
  }

  // Update morph target influence
  setMorphTarget(targetName: string, value: number): void {
    const clampedValue = Math.max(0, Math.min(1, value))
    this.morphInfluences.set(targetName, clampedValue)
    this.applyMorphTargets()
  }

  // Set base expression (idle state)
  setBaseExpression(expression: Record<string, number>): void {
    Object.entries(expression).forEach(([target, value]) => {
      this.baseInfluences.set(target, value)
    })
    this.applyMorphTargets()
  }

  // Apply lip-sync based on phoneme data
  applyLipSync(lipSyncData: LipSyncData): void {
    const { phoneme, intensity } = lipSyncData

    // Reset lip-sync morph targets
    this.resetLipSync()

    switch (phoneme) {
      case 'open':
        // Open mouth for vowels (a, o, u)
        this.setMorphTarget('mouth_open', intensity * 0.8)
        this.setMorphTarget('jaw_open', intensity * 0.6)
        break

      case 'closed':
        // Closed mouth for consonants (m, b, p)
        this.setMorphTarget('mouth_wide', intensity * 0.4)
        break

      case 'wide':
        // Wide mouth for sibilants (s, f, th)
        this.setMorphTarget('mouth_wide', intensity * 0.7)
        break

      case 'rest':
      default:
        // Neutral position
        this.resetLipSync()
        break
    }
  }

  private resetLipSync(): void {
    this.setMorphTarget('mouth_open', 0)
    this.setMorphTarget('mouth_wide', 0)
    this.setMorphTarget('jaw_open', 0)
  }

  // Predefined expressions
  setExpression(expression: string): void {
    switch (expression) {
      case 'happy':
        this.setBaseExpression({
          smile: 0.8,
          brow_raise: 0.3,
        })
        break

      case 'sad':
        this.setBaseExpression({
          brow_raise: 0.6,
          smile: 0,
        })
        break

      case 'surprised':
        this.setBaseExpression({
          brow_raise: 0.9,
          mouth_open: 0.3,
        })
        break

      case 'neutral':
      default:
        this.setBaseExpression({})
        break
    }
  }

  // Animate morph target to value over time
  animateMorphTarget(targetName: string, targetValue: number, duration: number = 0.3): void {
    const startValue = this.morphInfluences.get(targetName) || 0
    const startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing
      const easedProgress = this.easeInOutQuad(progress)
      const currentValue = startValue + (targetValue - startValue) * easedProgress
      
      this.setMorphTarget(targetName, currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // Easing function
  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  // Blink animation
  blink(): void {
    this.animateMorphTarget('eye_blink', 1, 0.1)
    setTimeout(() => {
      this.animateMorphTarget('eye_blink', 0, 0.1)
    }, 150)
  }

  // Random blinking
  startRandomBlinking(): void {
    const blinkInterval = () => {
      const delay = Math.random() * 4000 + 2000 // 2-6 seconds
      setTimeout(() => {
        this.blink()
        blinkInterval()
      }, delay)
    }
    blinkInterval()
  }

  // Apply all morph targets to the avatar mesh
  private applyMorphTargets(): void {
    this.avatar.traverse((child) => {
      if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
        Object.entries(MORPH_TARGETS).forEach(([targetName, targetIndex]) => {
          const baseInfluence = this.baseInfluences.get(targetName) || 0
          const morphInfluence = this.morphInfluences.get(targetName) || 0
          const totalInfluence = Math.max(0, Math.min(1, baseInfluence + morphInfluence))
          
          if (child.morphTargetInfluences) {
            child.morphTargetInfluences[targetIndex] = totalInfluence
          }
        })
      }
    })
  }

  // Get current morph target values
  getMorphTarget(targetName: string): number {
    return this.morphInfluences.get(targetName) || 0
  }

  // Reset all morph targets
  reset(): void {
    this.morphInfluences.clear()
    this.baseInfluences.clear()
    this.initializeMorphTargets()
    this.applyMorphTargets()
  }

  // Export morph target state for debugging
  exportState(): Record<string, number> {
    const state: Record<string, number> = {}
    this.morphInfluences.forEach((value, key) => {
      state[key] = value
    })
    return state
  }
}