import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ai_companions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ companions: data })
  } catch (error) {
    console.error('Error fetching companions:', error)
    return NextResponse.json({ error: 'Failed to fetch companions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, companionName, personalityTraits, avatarStyle, conversationTone } = body

    if (!userId || !companionName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ai_companions')
      .insert({
        user_id: userId,
        companion_name: companionName,
        personality_traits: personalityTraits,
        avatar_style: avatarStyle,
        conversation_tone: conversationTone,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ companion: data })
  } catch (error) {
    console.error('Error creating companion:', error)
    return NextResponse.json({ error: 'Failed to create companion' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Companion ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('ai_companions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ companion: data })
  } catch (error) {
    console.error('Error updating companion:', error)
    return NextResponse.json({ error: 'Failed to update companion' }, { status: 500 })
  }
}