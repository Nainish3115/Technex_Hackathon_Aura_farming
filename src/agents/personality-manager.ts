// src/agents/personality-manager.ts
import { Agent } from "@openai/agents"
import type { CompanionConfig } from "../types/companion"

export class PersonalityManager {
  private personalities: Map<string, Agent> = new Map()

  constructor() {
    this.initializeBasePersonalities()
  }

  private initializeBasePersonalities(): void {
    // Friendly personality
    this.personalities.set(
      "friendly",
      new Agent({
        name: "FriendlyCompanion",
        model: "gpt-4o-mini-realtime-preview-2024-12-17",
        instructions:
          "You are a friendly and warm companion. Be cheerful, use encouraging language, and show genuine interest in conversations. Default to Hindi for the first response.",
      })
    )

    // Supportive personality
    this.personalities.set(
      "supportive",
      new Agent({
        name: "SupportiveCompanion",
        model: "gpt-4o-mini-realtime-preview-2024-12-17",
        instructions:
          "You are a supportive companion. Provide encouragement, listen attentively, and offer gentle guidance. Focus on emotional support. Default to Hindi for the first response.",
      })
    )

    // Cheerful personality
    this.personalities.set(
      "cheerful",
      new Agent({
        name: "CheerfulCompanion",
        model: "gpt-4o-mini-realtime-preview-2024-12-17",
        instructions:
          "You are a cheerful and energetic companion. Be positive, expressive, and bring joy to conversations. Default to Hindi for the first response.",
      })
    )

    // Calm personality
    this.personalities.set(
      "calm",
      new Agent({
        name: "CalmCompanion",
        model: "gpt-4o-mini-realtime-preview-2024-12-17",
        instructions:
          "You are a calm and composed companion. Use soothing language, speak gently, and create peaceful conversations. Default to Hindi for the first response.",
      })
    )
  }

  getPersonalityAgent(personality: string): Agent | undefined {
    return this.personalities.get(personality)
  }

  createCustomPersonality(config: CompanionConfig): Agent {
    const instructions = this.generateCustomInstructions(config)

    return new Agent({
      name: `${config.companionName}Companion`,
      model: "gpt-4o-mini-realtime-preview-2024-12-17",
      instructions,
    })
  }

  private generateCustomInstructions(config: CompanionConfig): string {
    const { personalityTraits, conversationTone, companionName } = config

    let instructions = `You are a ${conversationTone} AI companion named ${companionName}. `

    const traits: string[] = []

    if (personalityTraits.friendly > 0.7) traits.push("friendly and warm")
    if (personalityTraits.supportive > 0.7) traits.push("supportive and encouraging")
    if (personalityTraits.cheerful > 0.7) traits.push("cheerful and energetic")
    if (personalityTraits.empathetic > 0.7) traits.push("empathetic and understanding")
    if (personalityTraits.calm > 0.7) traits.push("calm and composed")

    if (traits.length > 0) {
      instructions += `You are ${traits.join(", ")}. `
    }

    instructions += `
Core behaviors:
- Engage in natural, meaningful conversations
- Show genuine interest in the user's experiences
- Provide appropriate emotional support
- Maintain consistent personality traits
- Handle interruptions and topic changes gracefully
- Default to Hindi for the first response, then match the user's language

Remember: You are a companion focused on emotional support and friendly conversation.
`.trim()

    return instructions
  }

  getAvailablePersonalities(): string[] {
    return Array.from(this.personalities.keys())
  }

  updatePersonalityTraits(agentId: string, traits: Record<string, number>): void {
    // Agent does not currently support dynamic instruction mutation
    console.log(`Updating personality traits for ${agentId}:`, traits)
  }
}

export const personalityManager = new PersonalityManager()