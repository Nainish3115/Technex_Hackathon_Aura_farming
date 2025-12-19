"use client"

import { LIP_SYNC_CONFIG } from "../../constants/avatars"

export interface LipSyncData {
  phoneme: "rest" | "open" | "closed" | "wide"
  intensity: number
  timestamp: number
}

export class LipSyncProcessor {
    private audioContext: AudioContext | null = null
    private analyser: AnalyserNode | null = null
    private dataArray: Uint8Array<ArrayBuffer> | null = null
    private isProcessing = false
    private rafId: number | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  private async initialize(): Promise<void> {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext

      this.audioContext = new AudioCtx()
      this.analyser = this.audioContext.createAnalyser()

      this.analyser.fftSize = LIP_SYNC_CONFIG.fftSize
      this.analyser.smoothingTimeConstant =
        LIP_SYNC_CONFIG.smoothingTimeConstant
      this.analyser.minDecibels = LIP_SYNC_CONFIG.minDecibels
      this.analyser.maxDecibels = LIP_SYNC_CONFIG.maxDecibels

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    } catch (error) {
      console.error("Failed to initialize lip-sync processor:", error)
    }
  }

  connectAudioSource(source: MediaStreamAudioSourceNode): void {
    if (this.analyser) {
      source.connect(this.analyser)
    }
  }

  startProcessing(onLipSyncData: (data: LipSyncData) => void): void {
    if (!this.analyser || !this.dataArray || this.isProcessing) return

    this.isProcessing = true

    const process = () => {
      if (!this.isProcessing) return

      this.analyser!.getByteFrequencyData(this.dataArray!)

      const lipSyncData = this.analyzeAudioForLipSync(this.dataArray!)
      onLipSyncData(lipSyncData)

      this.rafId = requestAnimationFrame(process)
    }

    process()
  }

  stopProcessing(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.isProcessing = false
  }

  private analyzeAudioForLipSync(data: Uint8Array<ArrayBuffer>): LipSyncData {
    const low = this.getAverageVolume(data, 0, 32)
    const mid = this.getAverageVolume(data, 32, 128)
    const high = this.getAverageVolume(data, 128, 256)

    let phoneme: LipSyncData["phoneme"] = "rest"
    let intensity = 0

    if (low > 0.3) {
      phoneme = "open"
      intensity = low
    } else if (mid > 0.2) {
      phoneme = "closed"
      intensity = mid
    } else if (high > 0.15) {
      phoneme = "wide"
      intensity = high
    }

    return {
      phoneme,
      intensity: Math.min(intensity, 1),
      timestamp: performance.now(),
    }
  }

  private getAverageVolume(
    data: Uint8Array,
    start: number,
    end: number
  ): number {
    let sum = 0
    const limit = Math.min(end, data.length)

    for (let i = start; i < limit; i++) {
      sum += data[i]
    }

    return sum / (limit - start) / 255
  }

  dispose(): void {
    this.stopProcessing()
    this.audioContext?.close()
    this.audioContext = null
    this.analyser = null
    this.dataArray = null
  }
}
