'use client'

import React, { useState } from 'react'
import { useCompanionContext } from '../../lib/hooks/useCompanionContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'

interface CompanionSettingsProps {
  companionId?: string
}

export const CompanionSettings: React.FC<CompanionSettingsProps> = ({ companionId }) => {
  const { activeCompanion, updateCompanionSettings } = useCompanionContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    companionName: activeCompanion?.companionName || '',
    conversationTone: activeCompanion?.conversationTone || 'friendly',
    avatarStyle: activeCompanion?.avatarStyle || 'calm',
    personalityTraits: activeCompanion?.personalityTraits || {
      friendly: 0.7,
      supportive: 0.7,
      cheerful: 0.6,
      empathetic: 0.7,
      calm: 0.6,
    }
  })

  const handleSave = async () => {
    if (!activeCompanion) return

    try {
      await updateCompanionSettings(activeCompanion.id, formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update companion settings:', error)
    }
  }

  const handleTraitChange = (trait: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      personalityTraits: {
        ...prev.personalityTraits,
        [trait]: value / 100 // Convert to 0-1 range
      }
    }))
  }

  const personalityTraits = [
    { key: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { key: 'supportive', label: 'Supportive', description: 'Encouraging and helpful' },
    { key: 'cheerful', label: 'Cheerful', description: 'Positive and energetic' },
    { key: 'empathetic', label: 'Empathetic', description: 'Understanding and caring' },
    { key: 'calm', label: 'Calm', description: 'Peaceful and composed' },
  ]

  if (!activeCompanion) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Companion Settings</h3>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No active companion selected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Companion Settings</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <>
            <Input
              label="Companion Name"
              value={formData.companionName}
              onChange={(e) => setFormData(prev => ({ ...prev, companionName: e.target.value }))}
              placeholder="Enter companion name"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Conversation Tone
              </label>
              <select
                value={formData.conversationTone}
                onChange={(e) => setFormData(prev => ({ ...prev, conversationTone: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="friendly">Friendly</option>
                <option value="supportive">Supportive</option>
                <option value="cheerful">Cheerful</option>
                <option value="calm">Calm</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Avatar Style
              </label>
              <select
                value={formData.avatarStyle}
                onChange={(e) => setFormData(prev => ({ ...prev, avatarStyle: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="calm">Calm</option>
                <option value="expressive">Expressive</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">Personality Traits</h4>
              {personalityTraits.map((trait) => (
                <div key={trait.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      {trait.label}
                    </label>
                    <span className="text-sm text-gray-500">
                      {Math.round((formData.personalityTraits[trait.key as keyof typeof formData.personalityTraits] || 0) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round((formData.personalityTraits[trait.key as keyof typeof formData.personalityTraits] || 0) * 100)}
                    onChange={(e) => handleTraitChange(trait.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">{trait.description}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Basic Information
              </h4>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {activeCompanion.companionName}</p>
                <p><span className="font-medium">Tone:</span> {activeCompanion.conversationTone}</p>
                <p><span className="font-medium">Style:</span> {activeCompanion.avatarStyle}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Personality Traits
              </h4>
              <div className="mt-2 space-y-3">
                {personalityTraits.map((trait) => {
                  const value = activeCompanion.personalityTraits[trait.key as keyof typeof activeCompanion.personalityTraits] || 0
                  return (
                    <div key={trait.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{trait.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${value * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-8">
                          {Math.round(value * 100)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}