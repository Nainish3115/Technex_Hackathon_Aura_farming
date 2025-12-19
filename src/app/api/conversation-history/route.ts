import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companionId = searchParams.get('companionId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId || !companionId) {
      return NextResponse.json({ error: 'User ID and Companion ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('companion_id', companionId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Return in chronological order (oldest first)
    const messages = data.reverse().map(msg => ({
      id: msg.id,
      messageType: msg.message_type,
      content: msg.content,
      audioUrl: msg.audio_url,
      emotionDetected: msg.emotion_detected,
      timestamp: msg.timestamp
    }))

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching conversation history:', error)
    return NextResponse.json({ error: 'Failed to fetch conversation history' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, companionId, sessionId, messageType, content, audioUrl, emotionDetected } = body

    if (!userId || !companionId || !sessionId || !messageType || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        companion_id: companionId,
        session_id: sessionId,
        message_type: messageType,
        content,
        audio_url: audioUrl,
        emotion_detected: emotionDetected,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message: data })
  } catch (error) {
    console.error('Error saving conversation message:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const companionId = searchParams.get('companionId')

    if (!userId || !companionId) {
      return NextResponse.json({ error: 'User ID and Companion ID required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('user_id', userId)
      .eq('companion_id', companionId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing conversation history:', error)
    return NextResponse.json({ error: 'Failed to clear conversation history' }, { status: 500 })
  }
}