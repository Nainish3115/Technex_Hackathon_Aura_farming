// src/app/family/page.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'

interface FamilyMessage {
  id: string
  from: string
  message: string
  time: string
  type: 'text' | 'photo' | 'video'
}

interface FamilyMember {
  id: string
  name: string
  relation: string
  lastSeen: string
  avatar: string
}

export default function FamilyPage() {
  const [messages, setMessages] = useState<FamilyMessage[]>([
    {
      id: '1',
      from: 'Daughter',
      message: 'Hi Mom! How are you feeling today? 😊',
      time: '2 hours ago',
      type: 'text'
    },
    {
      id: '2',
      from: 'Son',
      message: 'Sent you a photo from our trip!',
      time: '1 day ago',
      type: 'photo'
    }
  ])

  const [familyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Priya',
      relation: 'Daughter',
      lastSeen: '2 hours ago',
      avatar: '👩'
    },
    {
      id: '2',
      name: 'Rahul',
      relation: 'Son',
      lastSeen: '1 day ago',
      avatar: '👨'
    },
    {
      id: '3',
      name: 'Sita',
      relation: 'Granddaughter',
      lastSeen: '3 days ago',
      avatar: '👧'
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const sendMessage = () => {
    if (!newMessage.trim()) return
    
    const message: FamilyMessage = {
      id: Date.now().toString(),
      from: 'You',
      message: newMessage,
      time: 'Just now',
      type: 'text'
    }
    
    setMessages(prev => [message, ...prev])
    setNewMessage('')
  }

  const getAIMessageSuggestion = async () => {
    setIsLoadingAI(true)
    try {
      const response = await fetch('/api/family-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'message_suggestion',
          context: 'Sending love to family members'
        })
      })
      
      const data = await response.json()
      setAiSuggestion(data.response || 'I love you and miss you dearly! ❤️')
    } catch (error) {
      setAiSuggestion('Thinking of you with lots of love! ❤️')
    }
    setIsLoadingAI(false)
  }

  const useAISuggestion = () => {
    setNewMessage(aiSuggestion)
    setAiSuggestion('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">AI Family Assistant</h1>
              <p className="text-amber-600 mt-1">Stay connected with AI-powered family support</p>
            </div>
            <Link href="/companion">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Back to Companion
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Family Messages */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Message Helper */}
            <div className="bg-white rounded-lg border-4 border-amber-300 shadow-lg p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
                🤖 AI Message Helper
              </h2>
              
              <div className="space-y-4">
                <Button 
                  onClick={getAIMessageSuggestion}
                  disabled={isLoadingAI}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {isLoadingAI ? 'Getting suggestion...' : '💡 Suggest a loving message'}
                </Button>
                
                {aiSuggestion && (
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 mb-3">{aiSuggestion}</p>
                    <Button 
                      onClick={useAISuggestion}
                      className="bg-amber-600 hover:bg-amber-700 text-sm"
                    >
                      Use This Message
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Message Composer */}
            <div className="bg-white rounded-lg border-4 border-orange-300 shadow-lg p-6">
              <h2 className="text-xl font-bold text-orange-900 mb-4">Send a Message</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button 
                  onClick={sendMessage}
                  className="bg-orange-600 hover:bg-orange-700 px-6"
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="bg-white rounded-lg border-4 border-yellow-300 shadow-lg p-6">
              <h2 className="text-xl font-bold text-yellow-900 mb-4">Family Messages</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl">{message.from === 'You' ? '👵' : '👨‍👩‍👧‍👦'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-yellow-900">{message.from}</span>
                        <span className="text-xs text-yellow-600">{message.time}</span>
                      </div>
                      <p className="text-yellow-800">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Family Members Sidebar */}
          <div className="space-y-6">
            {/* Family Members */}
            <div className="bg-white rounded-lg border-4 border-amber-300 shadow-lg p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">Family Members</h2>
              
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                    <div className="text-3xl">{member.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-900">{member.name}</h3>
                      <p className="text-sm text-amber-700">{member.relation}</p>
                      <p className="text-xs text-amber-600">Last seen: {member.lastSeen}</p>
                    </div>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border-4 border-orange-300 shadow-lg p-6">
              <h2 className="text-xl font-bold text-orange-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2">
                  📸 Share Photo
                </Button>
                
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 flex items-center justify-center gap-2">
                  📹 Video Call
                </Button>
                
                <Button className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2">
                  ❤️ Send Love
                </Button>
              </div>
            </div>

            {/* AI Memory Helper */}
            <div className="bg-white rounded-lg border-4 border-yellow-300 shadow-lg p-6">
              <h2 className="text-xl font-bold text-yellow-900 mb-4">AI Memory Helper</h2>
              
              <div className="space-y-3">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-sm">
                  📖 Create Family Story
                </Button>
                
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-sm">
                  🖼️ Describe Photo
                </Button>
                
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-sm">
                  💝 Memory Reminder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}