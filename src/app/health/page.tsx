// src/app/health/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'

interface Medicine {
  id: string
  name: string
  dosage: string
  time: string
  taken: boolean
  days: string[]
}

interface Appointment {
  id: string
  title: string
  date: string
  time: string
  type: string
}

export default function HealthPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Blood Pressure Medicine',
      dosage: '1 tablet',
      time: '9:00 AM',
      taken: false,
      days: ['Mon', 'Wed', 'Fri']
    },
    {
      id: '2',
      name: 'Heart Medicine',
      dosage: '2 tablets',
      time: '8:00 PM',
      taken: false,
      days: ['Daily']
    }
  ])

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Doctor Check-up',
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Cardiology'
    },
    {
      id: '2',
      title: 'Dental Cleaning',
      date: '2024-01-20',
      time: '10:00 AM',
      type: 'Dentistry'
    }
  ])

  const [healthStats, setHealthStats] = useState({
    water: 4,
    steps: 2340,
    sleep: 6.5,
    mood: 'Good'
  })

  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  const toggleMedicine = (id: string) => {
    setMedicines(prev => prev.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ))
  }

  const getAIHealthAdvice = async () => {
    if (!aiQuery.trim()) return
    
    setIsLoadingAI(true)
    try {
      const response = await fetch('/api/health-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: aiQuery,
          healthData: {
            medicines: medicines.map(m => ({ name: m.name, taken: m.taken })),
            stats: healthStats,
            appointments: appointments.length
          }
        })
      })
      
      const data = await response.json()
      setAiResponse(data.advice || 'I\'m here to help with your health questions!')
    } catch (error) {
      setAiResponse('I\'m having trouble connecting right now. Please try again later.')
    }
    setIsLoadingAI(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">AI Health Assistant</h1>
              <p className="text-amber-600 mt-1">Get personalized health advice and support</p>
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
        {/* AI Health Advisor */}
        <div className="bg-white rounded-lg border-4 border-amber-300 shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4 flex items-center">
            🤖 AI Health Advisor
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask me about your health, medicines, or wellness..."
                className="flex-1 px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 text-lg"
                onKeyPress={(e) => e.key === 'Enter' && getAIHealthAdvice()}
              />
              <Button 
                onClick={getAIHealthAdvice}
                disabled={isLoadingAI}
                className="bg-amber-600 hover:bg-amber-700 px-8 py-3"
              >
                {isLoadingAI ? 'Thinking...' : 'Ask AI'}
              </Button>
            </div>
            
            {aiResponse && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💜</div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">AI Health Advisor Says:</h3>
                    <p className="text-amber-800 leading-relaxed">{aiResponse}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border-4 border-amber-200 p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">💧</div>
            <div className="text-3xl font-bold text-amber-900">{healthStats.water}</div>
            <div className="text-amber-600">Glasses of Water</div>
          </div>
          
          <div className="bg-white rounded-lg border-4 border-orange-200 p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🚶‍♀️</div>
            <div className="text-3xl font-bold text-orange-900">{healthStats.steps.toLocaleString()}</div>
            <div className="text-orange-600">Steps Today</div>
          </div>
          
          <div className="bg-white rounded-lg border-4 border-yellow-200 p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">😴</div>
            <div className="text-3xl font-bold text-yellow-900">{healthStats.sleep}h</div>
            <div className="text-yellow-600">Sleep Last Night</div>
          </div>
          
          <div className="bg-white rounded-lg border-4 border-amber-300 p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">😊</div>
            <div className="text-3xl font-bold text-amber-900">{healthStats.mood}</div>
            <div className="text-amber-600">Today's Mood</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medicine Tracker */}
          <div className="bg-white rounded-lg border-4 border-amber-300 shadow-lg p-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
              💊 Medicine Tracker
            </h2>
            
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900">{medicine.name}</h3>
                    <p className="text-sm text-amber-700">{medicine.dosage} • {medicine.time}</p>
                    <p className="text-xs text-amber-600">Days: {medicine.days.join(', ')}</p>
                  </div>
                  <button
                    onClick={() => toggleMedicine(medicine.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      medicine.taken 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-amber-300 hover:border-amber-500'
                    }`}
                  >
                    {medicine.taken ? '✓' : ''}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-lg border-4 border-orange-300 shadow-lg p-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
              📅 Upcoming Appointments
            </h2>
            
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <h3 className="font-semibold text-orange-900">{appointment.title}</h3>
                  <p className="text-sm text-orange-700">{appointment.type}</p>
                  <p className="text-sm text-orange-600">{appointment.date} at {appointment.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border-4 border-amber-300 shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Set Reminder</h3>
            <p className="text-amber-600 mb-4">Get notified about medicines and appointments</p>
            <Button className="bg-amber-600 hover:bg-amber-700 w-full">
              Set Reminder
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border-4 border-red-300 shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Emergency</h3>
            <p className="text-red-600 mb-4">Quick access to emergency contacts</p>
            <Button className="bg-red-600 hover:bg-red-700 w-full">
              Emergency Call
            </Button>
          </div>
          
          <div className="bg-white rounded-lg border-4 border-yellow-300 shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-yellow-900 mb-2">Health Report</h3>
            <p className="text-yellow-600 mb-4">View your health trends and progress</p>
            <Button className="bg-yellow-600 hover:bg-yellow-700 w-full">
              View Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}