// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function PUT(request: NextRequest) {
  try {
    const { userId, firstName, lastName, phoneNumber, dateOfBirth } = await request.json()

    console.log('Profile update request:', { userId, firstName, lastName, phoneNumber, dateOfBirth })

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user email from auth.users (needed for profile creation)
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    
    if (userError) {
      console.error('Error getting user data:', userError)
    }

    const userEmail = userData?.user?.email || ''

    // Upsert profile (insert if doesn't exist, update if exists)
    const { data: updatedProfile, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: userEmail,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (upsertError) {
      console.error('Profile upsert error:', upsertError)
      throw upsertError
    }

    console.log('Profile updated successfully:', updatedProfile)

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    })

  } catch (error) {
    console.error('Profile update error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: `Failed to update profile: ${errorMessage}` },
      { status: 500 }
    )
  }
}