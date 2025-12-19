'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { useCompanionContext } from '../../lib/hooks/useCompanionContext'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/Card'

const personalityOptions = [
  {
    id: 'friendly',
    name: 'Friendly Friend',
    description: 'A warm and approachable companion who loves to chat about everyday things.',
    traits: ['friendly', 'cheerful', 'conversational'],
    avatar: '😊'
  },
  {
    id: 'supportive',
    name: 'Caring Guide',
    description: 'A supportive companion who provides encouragement and helpful advice.',
    traits: ['empathetic', 'supportive', 'wise'],
    avatar: '🤗'
  },
  {
    id: 'cheerful',
    name: 'Joyful Buddy',
    description: 'An energetic companion who brings positivity and fun to conversations.',
    traits: ['cheerful', 'energetic', 'fun'],
    avatar: '🎉'
  },
  {
    id: 'calm',
    name: 'Peaceful Companion',
    description: 'A serene companion who offers calm and thoughtful conversations.',
    traits: ['calm', 'composed', 'peaceful'],
    avatar: '🧘'
  }
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedPersonality, setSelectedPersonality] = useState<string>('')
  const [companionName, setCompanionName] = useState('')
  const { createNewCompanion } = useCompanionContext()
  const router = useRouter()

  const handlePersonalitySelect = (personalityId: string) => {
    setSelectedPersonality(personalityId)
    const selected = personalityOptions.find(p => p.id === personalityId)
    if (selected) {
      setCompanionName(selected.name)
    }
  }

  const handleComplete = async () => {
    if (!selectedPersonality || !companionName.trim()) return

    try {
      const personality = personalityOptions.find(p => p.id === selectedPersonality)
      if (!personality) return

      await createNewCompanion({
        companionName: companionName,
        personalityTraits: {
          friendly: personality.traits.includes('friendly') ? 0.8 : 0.2,
          supportive: personality.traits.includes('supportive') ? 0.8 : 0.2,
          cheerful: personality.traits.includes('cheerful') ? 0.8 : 0.2,
          empathetic: personality.traits.includes('empathetic') ? 0.8 : 0.2,
          calm: personality.traits.includes('calm') ? 0.8 : 0.2,
        },
        avatarStyle: 'calm',
        conversationTone: selectedPersonality as any,
        isActive: true
      })

      router.push('/companion')
    } catch (error) {
      console.error('Failed to create companion:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-600'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 ${
                step >= 2 ? 'bg-amber-500' : 'bg-amber-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-amber-700">
              <span>Choose Personality</span>
              <span>Name Your Companion</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-lg border-4 border-amber-200 shadow-lg">
              <div className="p-8 border-b-4 border-amber-100">
                <h2 className="text-3xl font-bold text-amber-900 text-center">Choose Your Companion's Personality</h2>
                <p className="text-amber-700 mt-4 text-center text-lg">
                  Select the type of companion that best matches your preferences
                </p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {personalityOptions.map((personality) => (
                    <button
                      key={personality.id}
                      onClick={() => handlePersonalitySelect(personality.id)}
                      className={`p-6 border-4 rounded-lg text-left transition-all ${
                        selectedPersonality === personality.id
                          ? 'border-amber-500 bg-amber-50 shadow-lg'
                          : 'border-amber-200 hover:border-amber-300 hover:bg-amber-25'
                      }`}
                    >
                      <div className="text-5xl mb-4">{personality.avatar}</div>
                      <h3 className="text-xl font-semibold text-amber-900 mb-3">
                        {personality.name}
                      </h3>
                      <p className="text-amber-700 mb-4 text-lg">{personality.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {personality.traits.map((trait) => (
                          <span
                            key={trait}
                            className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full capitalize font-medium"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedPersonality}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-semibold py-4 px-8 rounded-lg text-xl transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg border-4 border-amber-200 shadow-lg">
              <div className="p-8 border-b-4 border-amber-100">
                <h2 className="text-3xl font-bold text-amber-900 text-center">Name Your Companion</h2>
                <p className="text-amber-700 mt-4 text-center text-lg">
                  Give your companion a personal name
                </p>
              </div>
              <div className="p-8">
                {selectedPersonality && (
                  <div className="text-center mb-8">
                    <div className="text-7xl mb-6">
                      {personalityOptions.find(p => p.id === selectedPersonality)?.avatar}
                    </div>
                    <p className="text-xl text-amber-700">
                      {personalityOptions.find(p => p.id === selectedPersonality)?.description}
                    </p>
                  </div>
                )}

                <div className="max-w-md mx-auto">
                  <label className="block text-lg font-medium text-amber-800 mb-3">
                    Companion Name
                  </label>
                  <input
                    type="text"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="Enter a name for your companion"
                    className="w-full px-4 py-4 border-4 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xl bg-amber-50"
                    maxLength={30}
                  />
                  <p className="text-amber-600 mt-2 text-lg">
                    {companionName.length}/30 characters
                  </p>
                </div>

                <div className="flex gap-6 mt-8 max-w-md mx-auto">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-4 border-amber-600 text-amber-700 hover:bg-amber-50 py-4 px-6 rounded-lg font-semibold text-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!companionName.trim()}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white py-4 px-6 rounded-lg font-semibold text-xl transition-colors"
                  >
                    Create Companion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}