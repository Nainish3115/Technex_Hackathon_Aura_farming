'use client'

import React, { useState } from 'react'
import { useCompanionContext } from '../../lib/hooks/useCompanionContext'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader } from '../ui/Card'

const companionPersonalities = [
  {
    id: 'friendly',
    name: 'Friendly Friend',
    description: 'Warm and cheerful conversations',
    traits: ['friendly', 'cheerful', 'supportive'],
    avatar: '😊'
  },
  {
    id: 'supportive', 
    name: 'Caring Companion',
    description: 'Empathetic and understanding support',
    traits: ['empathetic', 'supportive', 'calm'],
    avatar: '🤗'
  },
  {
    id: 'cheerful',
    name: 'Joyful Buddy',
    description: 'Energetic and positive interactions',
    traits: ['cheerful', 'energetic', 'fun'],
    avatar: '🎉'
  },
  {
    id: 'calm',
    name: 'Peaceful Guide',
    description: 'Serene and composed conversations',
    traits: ['calm', 'composed', 'wise'],
    avatar: '🧘'
  }
]

export const CompanionSelector: React.FC = () => {
  const { companions, activeCompanion, switchCompanion, createNewCompanion } = useCompanionContext()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCompanionName, setNewCompanionName] = useState('')

  const handlePersonalitySelect = async (personalityId: string) => {
    const personality = companionPersonalities.find(p => p.id === personalityId)
    if (!personality) return

    try {
      const newCompanion = await createNewCompanion({
        companionName: personality.name,
        personalityTraits: {
          friendly: personality.traits.includes('friendly') ? 0.8 : 0.2,
          supportive: personality.traits.includes('supportive') ? 0.8 : 0.2,
          cheerful: personality.traits.includes('cheerful') ? 0.8 : 0.2,
          empathetic: personality.traits.includes('empathetic') ? 0.8 : 0.2,
          calm: personality.traits.includes('calm') ? 0.8 : 0.2,
        },
        avatarStyle: 'calm',
        conversationTone: personalityId as any,
        isActive: true
      })

      if (newCompanion) {
        switchCompanion(newCompanion.id)
        setShowCreateForm(false)
        setNewCompanionName('')
      }
    } catch (error) {
      console.error('Failed to create companion:', error)
    }
  }

  const handleCustomCreate = async () => {
    if (!newCompanionName.trim()) return

    try {
      const newCompanion = await createNewCompanion({
        companionName: newCompanionName,
        personalityTraits: {
          friendly: 0.7,
          supportive: 0.7,
          cheerful: 0.6,
          empathetic: 0.7,
          calm: 0.6,
        },
        avatarStyle: 'calm',
        conversationTone: 'friendly',
        isActive: true
      })

      if (newCompanion) {
        switchCompanion(newCompanion.id)
        setShowCreateForm(false)
        setNewCompanionName('')
      }
    } catch (error) {
      console.error('Failed to create custom companion:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Your Companions</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'New Companion'}
        </Button>
      </div>

      {showCreateForm ? (
        <Card>
          <CardHeader>
            <h4 className="text-md font-medium">Choose a Personality</h4>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {companionPersonalities.map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => handlePersonalitySelect(personality.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-2xl mb-2">{personality.avatar}</div>
                  <h5 className="font-medium text-gray-900">{personality.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{personality.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {personality.traits.map((trait) => (
                      <span key={trait} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                        {trait}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-2">Or Create Custom</h5>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter companion name..."
                  value={newCompanionName}
                  onChange={(e) => setNewCompanionName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomCreate()}
                />
                <Button onClick={handleCustomCreate} disabled={!newCompanionName.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {companions.map((companion) => (
            <button
              key={companion.id}
              onClick={() => switchCompanion(companion.id)}
              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                activeCompanion?.id === companion.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{companion.companionName}</h4>
                  <p className="text-sm text-gray-600 capitalize">{companion.conversationTone} • {companion.avatarStyle}</p>
                </div>
                <div className="text-2xl">
                  {companion.conversationTone === 'friendly' && '😊'}
                  {companion.conversationTone === 'supportive' && '🤗'}
                  {companion.conversationTone === 'cheerful' && '🎉'}
                  {companion.conversationTone === 'calm' && '🧘'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}