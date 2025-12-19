import type { ConversationMessage } from '../types/conversation'

export class ConversationFlowManager {
  private conversationHistory: ConversationMessage[] = []
  private contextWindow = 10 // Keep last 10 messages for context

  addMessage(message: ConversationMessage): void {
    this.conversationHistory.push(message)
    
    // Keep only recent messages
    if (this.conversationHistory.length > this.contextWindow) {
      this.conversationHistory = this.conversationHistory.slice(-this.contextWindow)
    }
  }

  getConversationContext(): ConversationMessage[] {
    return this.conversationHistory.slice(-5) // Return last 5 messages
  }

  getConversationSummary(): string {
    if (this.conversationHistory.length === 0) return "No conversation history"

    const recentMessages = this.conversationHistory.slice(-3)
    const topics = this.extractTopics(recentMessages)
    
    return `Recent conversation topics: ${topics.join(", ")}`
  }

  private extractTopics(messages: ConversationMessage[]): string[] {
    // Simple topic extraction based on keywords
    const keywords = {
      family: ['family', 'son', 'daughter', 'wife', 'husband', 'children'],
      health: ['health', 'doctor', 'medicine', 'pain', 'feeling'],
      weather: ['weather', 'rain', 'sunny', 'temperature', 'cold', 'hot'],
      food: ['food', 'eat', 'meal', 'hungry', 'cook', 'recipe'],
      hobbies: ['hobby', 'interest', 'like', 'enjoy', 'music', 'book'],
      daily: ['morning', 'evening', 'today', 'yesterday', 'routine']
    }

    const foundTopics: string[] = []
    
    messages.forEach(message => {
      const content = message.content.toLowerCase()
      
      Object.entries(keywords).forEach(([topic, words]) => {
        if (words.some(word => content.includes(word)) && !foundTopics.includes(topic)) {
          foundTopics.push(topic)
        }
      })
    })

    return foundTopics.length > 0 ? foundTopics : ['general conversation']
  }

  detectEmotionalState(): 'positive' | 'neutral' | 'negative' | 'unknown' {
    if (this.conversationHistory.length < 2) return 'unknown'

    const recentMessages = this.conversationHistory.slice(-3)
    let positiveWords = 0
    let negativeWords = 0

    const positiveKeywords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'nice', 'love', 'enjoy']
    const negativeKeywords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'upset', 'worried']

    recentMessages.forEach(message => {
      const content = message.content.toLowerCase()
      
      positiveKeywords.forEach(word => {
        if (content.includes(word)) positiveWords++
      })
      
      negativeKeywords.forEach(word => {
        if (content.includes(word)) negativeWords++
      })
    })

    if (positiveWords > negativeWords) return 'positive'
    if (negativeWords > positiveWords) return 'negative'
    return 'neutral'
  }

  shouldTransitionTopic(): boolean {
    if (this.conversationHistory.length < 5) return false

    const recentMessages = this.conversationHistory.slice(-5)
    const lastTopic = this.extractTopics([recentMessages[recentMessages.length - 1]])
    
    // Check if conversation has been on same topic for too long
    let sameTopicCount = 0
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const messageTopics = this.extractTopics([recentMessages[i]])
      if (messageTopics.some(topic => lastTopic.includes(topic))) {
        sameTopicCount++
      } else {
        break
      }
    }

    return sameTopicCount >= 3 // Suggest topic change after 3+ messages on same topic
  }

  getSuggestedTopics(): string[] {
    const currentTopics = this.extractTopics(this.conversationHistory.slice(-5))
    
    const allTopics = [
      'family', 'health', 'weather', 'food', 'hobbies', 
      'memories', 'future plans', 'daily activities', 'entertainment'
    ]
    
    // Return topics not recently discussed
    return allTopics.filter(topic => !currentTopics.includes(topic)).slice(0, 3)
  }

  clearHistory(): void {
    this.conversationHistory = []
  }

  getMessageCount(): number {
    return this.conversationHistory.length
  }

  exportHistory(): ConversationMessage[] {
    return [...this.conversationHistory]
  }
}

export const conversationFlowManager = new ConversationFlowManager()