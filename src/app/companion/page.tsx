// src/app/companion/page.tsx
'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { VoiceControls } from '../../components/companion/VoiceControls'
import { useVoiceSessionContext } from '../../components/providers/VoiceSessionProvider'

// Dynamically import Avatar3D to avoid SSR issues
const Avatar3D = dynamic(() => import('../../components/companion/Avatar3D').then(mod => mod.Avatar3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-amber-50 rounded-lg border-4 border-amber-200 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">👵</div>
        <div className="text-xl font-medium text-amber-800">Loading Your Friend...</div>
      </div>
    </div>
  )
})

// Daily Tips Component
const DailyTips = () => {
  const tips = [
    "💊 Remember to take your morning medications after breakfast",
    "🏃‍♀️ Take a short walk today - even 10 minutes helps!",
    "💧 Drink plenty of water throughout the day",
    "📞 Call a family member or friend today",
    "🧘 Practice deep breathing if you feel stressed"
  ]

  const randomTip = tips[Math.floor(Math.random() * tips.length)]

  return (
    <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4">
      <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
        💡 Daily Wellness Tip
      </h4>
      <p className="text-blue-800">{randomTip}</p>
    </div>
  )
}

// Health Reminders Component
const HealthReminders = () => {
  return (
    <div className="space-y-3">
      <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
        <h4 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
          💊 Medication Reminders
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-green-800">Morning: Blood Pressure Medicine</span>
            <span className="font-medium text-green-700">9:00 AM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-green-800">Evening: Heart Medicine</span>
            <span className="font-medium text-green-700">8:00 PM</span>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-4">
        <h4 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
          📅 Upcoming Appointments
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-purple-800">Doctor Check-up</span>
            <span className="font-medium text-purple-700">Tomorrow 2:00 PM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-purple-800">Dental Cleaning</span>
            <span className="font-medium text-purple-700">Friday 10:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Quick Health Questions Component
const QuickHealthCheck = () => {
  const questions = [
    "How are you feeling today?",
    "Have you taken your medications?",
    "Did you eat breakfast today?",
    "Are you getting enough sleep?",
    "How's your energy level?"
  ]

  const randomQuestion = questions[Math.floor(Math.random() * questions.length)]

  return (
    <div className="bg-orange-50 rounded-lg border-2 border-orange-200 p-4">
      <h4 className="text-lg font-semibold text-orange-900 mb-2 flex items-center">
        ❤️ Quick Health Check
      </h4>
      <p className="text-orange-800 mb-3">{randomQuestion}</p>
      <div className="flex space-x-2">
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
          Great!
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm">
          Okay
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
          Need Help
        </button>
      </div>
    </div>
  )
}

export default function CompanionPage() {
  const { state: voiceState, connect, disconnect } = useVoiceSessionContext()

  return (
    <ProtectedRoute>
      {/* Traditional background with warm colors */}
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 relative">
        {/* Optional background image overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/images/elderly-background.jpg')`, // Add your background image here
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Traditional wooden frame effect */}
        <div className="relative z-10 min-h-screen border-8 border-amber-800 bg-amber-50/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-8">
            
            {/* Traditional Header */}
            <div className="text-center mb-8 bg-white/90 rounded-lg p-6 shadow-lg border-4 border-amber-200">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-3 font-serif">
                Aashray - Your AI Companion
              </h1>
              <p className="text-xl text-amber-700 font-medium">
                A kind friend to chat with anytime
              </p>
            </div>

            {/* Main Content - Centered Layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              
              {/* Avatar Section - Prominent and Centered */}
              <div className="lg:w-1/2 space-y-6">
                {/* 3D Avatar in decorative square frame */}
                <div className="bg-white rounded-lg border-8 border-amber-600 shadow-2xl p-4">
                  <div className="bg-transparent rounded border-4 border-amber-300 p-2 aspect-square max-w-lg mx-auto">
                    <Avatar3D
                      isSpeaking={voiceState.isSpeaking}
                      isListening={voiceState.isListening}
                      audioLevel={voiceState.audioLevel}
                    />
                  </div>
                </div>

                {/* Voice Controls - Positioned below the square avatar */}
                <div className="bg-white/95 rounded-lg border-4 border-amber-400 shadow-lg p-6 max-w-lg mx-auto">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-amber-900 mb-4 font-serif">Voice Chat</h3>
                    <div className="flex justify-center">
                      <VoiceControls
                        isConnected={voiceState.isConnected}
                        isConnecting={voiceState.isConnecting}
                        onConnect={connect}
                        onDisconnect={disconnect}
                        isListening={voiceState.isListening}
                        isSpeaking={voiceState.isSpeaking}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Meaningful Information for Elderly Users */}
              <div className="lg:w-1/3 space-y-6">
                
                {/* Daily Wellness Tip */}
                <div className="bg-white/95 rounded-lg border-4 border-amber-400 shadow-lg p-6">
                  <DailyTips />
                </div>

                {/* Health Reminders */}
                <div className="bg-white/95 rounded-lg border-4 border-amber-400 shadow-lg p-6">
                  <HealthReminders />
                </div>

                {/* Quick Health Check */}
                <div className="bg-white/95 rounded-lg border-4 border-amber-400 shadow-lg p-6">
                  <QuickHealthCheck />
                </div>

                {/* Emergency Contacts */}
                <div className="bg-white/95 rounded-lg border-4 border-amber-400 shadow-lg p-6">
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-amber-900 mb-4 font-serif text-center">Emergency Contacts</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-2 border-red-200">
                        <span className="text-red-800 font-medium">Emergency Services</span>
                        <span className="text-red-700 font-bold">911</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <span className="text-blue-800 font-medium">Family Doctor</span>
                        <span className="text-blue-700 font-bold">555-0123</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                        <span className="text-green-800 font-medium">Caregiver</span>
                        <span className="text-green-700 font-bold">555-0456</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Information */}
                <div className="bg-white/95 rounded-lg border-4 border-amber-400 shadow-lg p-6">
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-amber-900 mb-4 font-serif">Today's Weather</h4>
                    <div className="text-6xl mb-2">☀️</div>
                    <div className="text-2xl font-semibold text-amber-800 mb-1">Sunny</div>
                    <div className="text-lg text-amber-700">72°F • Perfect for a walk!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}