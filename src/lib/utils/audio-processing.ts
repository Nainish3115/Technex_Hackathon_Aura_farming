// src/lib/utils/audio-processing.ts
export class AudioProcessor {
    private audioContext: AudioContext | null = null
    private analyser: AnalyserNode | null = null
    private dataArray: Uint8Array<ArrayBuffer> | null = null
    private isProcessing = false
  
    constructor() {
      this.initialize()
    }
  
    private async initialize(): Promise<void> {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        this.analyser = this.audioContext.createAnalyser()
  
        // Configure analyser for voice processing
        this.analyser.fftSize = 2048
        this.analyser.smoothingTimeConstant = 0.8
        this.analyser.minDecibels = -90
        this.analyser.maxDecibels = -10
  
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      } catch (error) {
        console.error('Failed to initialize audio processor:', error)
      }
    }
  
    connectSource(source: MediaStreamAudioSourceNode): void {
      if (this.analyser) {
        source.connect(this.analyser)
      }
    }
  
    startProcessing(onAudioData: (data: AudioData) => void): void {
      if (!this.analyser || !this.dataArray || this.isProcessing) return
  
      this.isProcessing = true
  
      const process = () => {
        if (!this.isProcessing) return
  
        this.analyser!.getByteFrequencyData(this.dataArray!)
  
        const audioData = this.processAudioData(this.dataArray!)
        onAudioData(audioData)
  
        requestAnimationFrame(process)
      }
  
      process()
    }
  
    stopProcessing(): void {
      this.isProcessing = false
    }
  
    private processAudioData(data: Uint8Array<ArrayBuffer>): AudioData {
      // Calculate overall volume level
      const volume = this.calculateRMS(data)
  
      // Detect if user is speaking (volume above threshold)
      const isSpeaking = volume > 0.01
  
      // Analyze frequency bands for voice characteristics
      const frequencyBands = this.analyzeFrequencyBands(data)
  
      // Detect voice pitch (fundamental frequency)
      const pitch = this.estimatePitch(data)
  
      // Classify voice type
      const voiceType = this.classifyVoice(volume, frequencyBands, pitch)
  
      return {
        level: volume,
        isSpeaking,
        frequencyData: new Float32Array(data.buffer.slice(0)),
        frequencyBands,
        pitch,
        voiceType,
        timestamp: Date.now()
      }
    }
  
    private calculateRMS(data: Uint8Array<ArrayBuffer>): number {
      let sum = 0
      for (let i = 0; i < data.length; i++) {
        sum += (data[i] / 255) ** 2
      }
      return Math.sqrt(sum / data.length)
    }
  
    private analyzeFrequencyBands(data: Uint8Array<ArrayBuffer>): FrequencyBands {
      const sampleRate = this.audioContext?.sampleRate || 44100
      const nyquist = sampleRate / 2
      const binSize = nyquist / data.length
  
      // Define frequency bands
      const bands = {
        low: { min: 85, max: 255, sum: 0, count: 0 },    // 85-255 Hz (male voices)
        mid: { min: 255, max: 2000, sum: 0, count: 0 },  // 255-2000 Hz (voice formants)
        high: { min: 2000, max: 8000, sum: 0, count: 0 } // 2000-8000 Hz (sibilants)
      }
  
      // Sum energy in each band
      for (let i = 0; i < data.length; i++) {
        const frequency = i * binSize
  
        Object.values(bands).forEach(band => {
          if (frequency >= band.min && frequency <= band.max) {
            band.sum += data[i]
            band.count++
          }
        })
      }
  
      // Calculate average energy per band
      return {
        low: bands.low.count > 0 ? bands.low.sum / bands.low.count / 255 : 0,
        mid: bands.mid.count > 0 ? bands.mid.sum / bands.mid.count / 255 : 0,
        high: bands.high.count > 0 ? bands.high.sum / bands.high.count / 255 : 0
      }
    }
  
    private estimatePitch(data: Uint8Array<ArrayBuffer>): number {
      // Simple pitch estimation using autocorrelation
      // This is a simplified implementation - real pitch detection is more complex
  
      const bufferLength = data.length
      const correlations = new Array(bufferLength).fill(0)
  
      // Calculate autocorrelation
      for (let lag = 1; lag < Math.min(bufferLength / 2, 1000); lag++) {
        let correlation = 0
        for (let i = 0; i < bufferLength - lag; i++) {
          correlation += (data[i] / 255) * (data[i + lag] / 255)
        }
        correlations[lag] = correlation / (bufferLength - lag)
      }
  
      // Find peak in autocorrelation (likely pitch period)
      let maxCorrelation = 0
      let pitchPeriod = 0
  
      for (let lag = 20; lag < correlations.length; lag++) { // Start from ~85Hz
        if (correlations[lag] > maxCorrelation) {
          maxCorrelation = correlations[lag]
          pitchPeriod = lag
        }
      }
  
      // Convert period to frequency
      if (pitchPeriod > 0 && this.audioContext) {
        const sampleRate = this.audioContext.sampleRate
        return sampleRate / pitchPeriod
      }
  
      return 0
    }
  
    private classifyVoice(volume: number, bands: FrequencyBands, pitch: number): VoiceType {
      if (volume < 0.01) return 'silent'
  
      // Classify based on pitch and frequency characteristics
      if (pitch > 0) {
        if (pitch < 165) return 'male_deep'
        if (pitch < 255) return 'male'
        if (pitch < 350) return 'female'
        return 'female_high'
      }
  
      // Fallback classification based on frequency bands
      if (bands.low > bands.mid) return 'male'
      if (bands.high > bands.mid) return 'female'
  
      return 'neutral'
    }
  
    // Get current audio levels for UI feedback
    getCurrentLevels(): { volume: number; isActive: boolean } {
      if (!this.dataArray) return { volume: 0, isActive: false }
  
      this.analyser?.getByteFrequencyData(this.dataArray)
      const volume = this.calculateRMS(this.dataArray)
  
      return {
        volume,
        isActive: volume > 0.01
      }
    }
  
    dispose(): void {
      this.stopProcessing()
      if (this.audioContext) {
        this.audioContext.close()
      }
    }
  }
  
  export interface AudioData {
    level: number
    isSpeaking: boolean
    frequencyData: Float32Array
    frequencyBands: FrequencyBands
    pitch: number
    voiceType: VoiceType
    timestamp: number
  }
  
  export interface FrequencyBands {
    low: number  // Low frequencies (male voices)
    mid: number  // Mid frequencies (voice formants)
    high: number // High frequencies (sibilants)
  }
  
  export type VoiceType = 'silent' | 'male_deep' | 'male' | 'female' | 'female_high' | 'neutral'