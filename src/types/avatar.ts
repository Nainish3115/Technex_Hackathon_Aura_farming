export interface AvatarConfig {
    modelUrl: string
    animationUrl?: string
    scale: [number, number, number]
    position: [number, number, number]
    morphTargets: {
      [key: string]: number
    }
  }
  
  export interface AvatarState {
    isLoaded: boolean
    isAnimating: boolean
    currentAnimation?: string
    morphTargetValues: Record<string, number>
    currentExpression: string
  }