"use client"

// src/lib/openai/realtime-client.ts
import { RealtimeSession } from "@openai/agents/realtime"
import { companionshipAgent } from "../../agents/companionship-agent"

interface RealtimeState {
  isConnected?: boolean
  isConnecting?: boolean
  isSpeaking?: boolean
  isListening?: boolean
  isInterrupted?: boolean
  audioLevel?: number
  currentText?: string
  audioData?: ArrayBuffer
  frequencyData?: Uint8Array
  status?: string
}

export class RealtimeVoiceClient {
  private session: RealtimeSession | null = null
  private audioContext: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private microphone: MediaStreamAudioSourceNode | null = null
  private rafId: number | null = null
  private isConnected = false

  constructor(
    private onAudioData?: (data: Float32Array) => void,
    private onStateChange?: (state: RealtimeState) => void,
    private onError?: (error: Error) => void
  ) {}

  async connect(apiKey: string): Promise<void> {
    try {
      this.onStateChange?.({ isConnecting: true, status: "Connecting..." })

      this.session = new RealtimeSession(companionshipAgent)

      this.setupEventListeners()
      await this.initializeAudio()
      await this.session.connect({ apiKey })

      this.isConnected = true

      this.onStateChange?.({
        isConnected: true,
        isConnecting: false,
        status: "Connected and ready",
      })
    } catch (error) {
      this.onError?.(error as Error)
      throw error
    }
  }

  private setupEventListeners(): void {
    if (!this.session) return

    this.session.on("text", (event: { text: string }) => {
      this.onStateChange?.({
        isSpeaking: true,
        currentText: event.text,
      })
    })

    this.session.on("audio_output", (event: { audio: ArrayBuffer }) => {
      this.onStateChange?.({
        isSpeaking: true,
        audioData: event.audio,
      })
    })

    this.session.on("interruption", () => {
      this.onStateChange?.({
        isSpeaking: false,
        isInterrupted: true,
      })
    })

    this.session.on("error", (error: { message: string }) => {
      this.onError?.(new Error(error.message))
    })
  }

  private async initializeAudio(): Promise<void> {
    if (typeof window === "undefined") return

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext

    this.audioContext = new AudioCtx()
    this.analyser = this.audioContext.createAnalyser()
    this.analyser.fftSize = 256
    this.analyser.smoothingTimeConstant = 0.8

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 16000,
      },
    })

    this.microphone = this.audioContext.createMediaStreamSource(stream)
    this.microphone.connect(this.analyser)

    this.startAudioAnalysis()
  }

  private startAudioAnalysis(): void {
    if (!this.analyser) return

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)

    const analyze = () => {
      if (!this.isConnected || !this.analyser) return

      this.analyser.getByteFrequencyData(dataArray)

      let sum = 0
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
      const audioLevel = sum / dataArray.length / 255

      const floatData = new Float32Array(dataArray.length)
      for (let i = 0; i < dataArray.length; i++) {
        floatData[i] = dataArray[i] / 255
      }

      this.onAudioData?.(floatData)

      this.onStateChange?.({
        audioLevel,
        isListening: audioLevel > 0.01,
        frequencyData: dataArray,
      })

      this.rafId = requestAnimationFrame(analyze)
    }

    analyze()
  }

  async disconnect(): Promise<void> {
    this.isConnected = false

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    this.microphone?.disconnect()
    this.microphone = null

    await this.audioContext?.close()
    this.audioContext = null

    if (this.session) {
      await this.session.close()
      this.session = null
    }

    this.onStateChange?.({
      isConnected: false,
      isSpeaking: false,
      isListening: false,
      audioLevel: 0,
      status: "Disconnected",
    })
  }

  sendAudio(_audioData: ArrayBuffer): void {
    if (!this.session || !this.isConnected) return
  }

  sendText(_text: string): void {
    if (!this.session || !this.isConnected) return
  }

  get isSessionConnected(): boolean {
    return this.isConnected
  }
}
