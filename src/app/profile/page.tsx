'use client'

import React, { useState, useEffect } from 'react'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { useSupabaseAuth } from '../../lib/hooks/useSupabaseAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'

export default function ProfilePage() {
  const { user, logout } = useSupabaseAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
  })

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSaveSuccess(true)
        setIsEditing(false)
        
        // Update local user state (optional - you might want to refresh user data)
        console.log('Profile updated successfully:', data.profile)
      } else {
        const error = await response.json()
        console.error('Failed to update profile:', error.error)
        alert('Failed to update profile. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('An error occurred while updating your profile.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-900">Profile Settings</h1>
            <p className="text-amber-700 mt-2">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border-4 border-amber-200 shadow-lg">
                <div className="p-6 border-b-4 border-amber-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-amber-900">Personal Information</h2>
                    <div className="flex items-center space-x-2">
                      {saveSuccess && (
                        <span className="text-green-600 text-sm font-medium">
                          ✓ Profile updated successfully!
                        </span>
                      )}
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium"
                        disabled={isSaving}
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-lg"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-lg"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-lg"
                      />
                      <input
                        type="date"
                        placeholder="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateOf_birth: e.target.value }))}
                        className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-lg"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-amber-500">First Name</label>
                          <p className="text-lg text-amber-900">{user.firstName || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-500">Last Name</label>
                          <p className="text-lg text-amber-900">{user.lastName || 'Not set'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-500">Email</label>
                          <p className="text-lg text-amber-900">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-500">Phone Number</label>
                          <p className="text-lg text-amber-900">{user.phoneNumber || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border-4 border-amber-200 shadow-lg">
                <div className="p-6 border-b-4 border-amber-100">
                  <h2 className="text-2xl font-bold text-amber-900">Account Actions</h2>
                </div>
                <div className="p-6 space-y-4">
                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg font-medium text-left flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </button>

                  <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg font-medium text-left flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Export Data
                  </button>

                  <hr className="my-4 border-amber-200" />

                  <button
                    onClick={logout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium text-left flex items-center"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg border-4 border-amber-200 shadow-lg">
                <div className="p-6 border-b-4 border-amber-100">
                  <h2 className="text-2xl font-bold text-amber-900">Account Information</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3 text-amber-800">
                    <p className="text-lg"><span className="font-medium">Account created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p className="text-lg"><span className="font-medium">Last login:</span> {new Date(user.updatedAt).toLocaleDateString()}</p>
                    <p className="text-lg"><span className="font-medium">User type:</span> {user.userType}</p>
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