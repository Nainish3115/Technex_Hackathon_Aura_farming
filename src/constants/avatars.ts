export const AVATAR_CONFIG = {
    modelUrl: "/models/avatar.glb",
    idleAnimation: "/models/avatar_idle.glb",
    scale: [1, 1, 1] as [number, number, number],
    position: [0, -1, 0] as [number, number, number],
    cameraPosition: [0, 1.6, 2] as [number, number, number],
  }
  
  export const MORPH_TARGETS = {
    mouth_open: 0,
    mouth_wide: 1,
    jaw_open: 2,
    brow_raise: 3,
    eye_blink: 4,
    smile: 5,
  } as const
  
  export const ANIMATIONS = {
    idle: "idle",
    talking: "talking",
    listening: "listening",
    happy: "happy",
    sad: "sad",
  } as const
  
  export const LIP_SYNC_CONFIG = {
    fftSize: 256,
    smoothingTimeConstant: 0.8,
    minDecibels: -90,
    maxDecibels: -10,
  }