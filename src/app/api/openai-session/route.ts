import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('Missing OPENAI_API_KEY')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const openai = new OpenAI({ apiKey })
    
    const session = await openai.beta.realtime.sessions.create({
      model: "gpt-4o-mini-realtime-preview-2024-12-17",
      voice: "sage",
    })

    return NextResponse.json({ 
      token: session.client_secret.value,
      expires_at: session.client_secret.expires_at 
    })
  } catch (error: any) {
    console.error('OpenAI session creation error:', error)
    return NextResponse.json({ 
      error: error?.message || 'Failed to create session',
      details: error?.stack
    }, { status: 500 })
  }
}