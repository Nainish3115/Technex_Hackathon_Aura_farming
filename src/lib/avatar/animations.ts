// src/lib/avatar/animations.ts
import * as THREE from 'three'
import { ANIMATIONS } from '../../constants/avatars'

export class AvatarAnimator {
  private mixer: THREE.AnimationMixer
  private animations: Map<string, THREE.AnimationAction> = new Map()
  private currentAction: THREE.AnimationAction | null = null
  private currentAnimationName: string | null = null
  private isTransitioning = false

  constructor(mixer: THREE.AnimationMixer) {
    this.mixer = mixer
  }

  addAnimation(name: string, clip: THREE.AnimationClip): void {
    const action = this.mixer.clipAction(clip)
    // Note: AnimationAction doesn't have a name property, so we track it separately
    this.animations.set(name, action)
  }

  play(animationName: string, fadeIn: number = 0.3, loop: boolean = true): boolean {
    const action = this.animations.get(animationName)
    if (!action) {
      console.warn(`Animation '${animationName}' not found`)
      return false
    }

    if (this.isTransitioning) return false

    // Stop current animation with fade out
    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(fadeIn)
      this.isTransitioning = true

      // Start new animation after fade out
      setTimeout(() => {
        this.startAnimation(action, fadeIn, loop, animationName)
      }, fadeIn * 1000)
    } else {
      this.startAnimation(action, fadeIn, loop, animationName)
    }

    return true
  }

  private startAnimation(
    action: THREE.AnimationAction, 
    fadeIn: number, 
    loop: boolean, 
    animationName: string
  ): void {
    if (loop) {
      action.loop = THREE.LoopRepeat
      action.clampWhenFinished = false
    } else {
      action.loop = THREE.LoopOnce
      action.clampWhenFinished = true
    }

    action.reset()
    action.fadeIn(fadeIn)
    action.play()

    this.currentAction = action
    this.currentAnimationName = animationName
    this.isTransitioning = false
  }

  stop(fadeOut: number = 0.3): void {
    if (this.currentAction) {
      this.currentAction.fadeOut(fadeOut)
      this.currentAction = null
      this.currentAnimationName = null
    }
  }

  pause(): void {
    if (this.currentAction) {
      this.currentAction.paused = true
    }
  }

  resume(): void {
    if (this.currentAction) {
      this.currentAction.paused = false
    }
  }

  setTime(time: number): void {
    if (this.currentAction) {
      this.currentAction.time = time
    }
  }

  getCurrentAnimation(): string | null {
    return this.currentAnimationName
  }

  getAnimationDuration(animationName: string): number {
    const action = this.animations.get(animationName)
    return action?.getClip().duration || 0
  }

  isPlaying(animationName?: string): boolean {
    if (!this.currentAction) return false
    if (animationName) {
      return this.currentAnimationName === animationName && this.currentAction.isRunning()
    }
    return this.currentAction.isRunning()
  }

  // Predefined animation sequences
  playIdleSequence(): void {
    this.play(ANIMATIONS.idle)
  }

  playTalkingSequence(): void {
    this.play(ANIMATIONS.talking)
  }

  playListeningSequence(): void {
    this.play(ANIMATIONS.listening)
  }

  playHappySequence(): void {
    this.play(ANIMATIONS.happy, 0.5, false)
  }

  playSadSequence(): void {
    this.play(ANIMATIONS.sad, 0.5, false)
  }

  // Blend animations for smooth transitions
  blendTo(animationName: string, duration: number = 0.5): void {
    const targetAction = this.animations.get(animationName)
    if (!targetAction || !this.currentAction) return

    this.currentAction.crossFadeTo(targetAction, duration, true)
    targetAction.play()
    this.currentAction = targetAction
    this.currentAnimationName = animationName
  }

  dispose(): void {
    this.stop()
    this.animations.clear()
  }
}