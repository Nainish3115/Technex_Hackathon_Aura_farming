// src/app/api/health-advice/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { query, healthData } = await request.json()
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const prompt = `You are a compassionate health assistant for elderly patients. 
    Provide gentle, encouraging advice about: ${query}
    
    Health context: ${JSON.stringify(healthData)}
    
    Keep responses warm, simple, and encouraging. Focus on safety and well-being.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: query }
      ],
      max_tokens: 200,
      temperature: 0.7
    })

    return NextResponse.json({ 
      advice: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Health advice error:', error)
    return NextResponse.json({ 
      error: 'Unable to get health advice right now' 
    }, { status: 500 })
  }
}