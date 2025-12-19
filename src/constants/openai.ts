export const OPENAI_CONFIG = {
    model: "gpt-4o-mini-realtime-preview-2024-12-17",
    voice: "alloy", // Default voice
    temperature: 0.7,
    maxTokens: 150,
  }
  
  export const VOICE_SETTINGS = {
    stability: 0.8,
    similarity_boost: 0.9,
    style: 0.6,
    use_speaker_boost: true,
  }
  
  export const CONVERSATION_SETTINGS = {
    maxSessionDuration: 3600000, // 1 hour
    maxMessagesPerSession: 100,
    bargeInEnabled: true,
    lowVolumeThreshold: 0.01,
  }