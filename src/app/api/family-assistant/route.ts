// src/app/api/family-assistant/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { action, context } = await request.json()
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    let prompt = ''
    
    switch (action) {
      case 'message_suggestion':
        prompt = `Suggest a warm, caring message for an elderly person to send to their family. 
        Context: ${context}. Keep it loving and personal.`
        break
        
      case 'photo_description':
        prompt = `Describe this family photo in a warm, emotional way that would make an elderly person feel connected to their family.
        Context: ${context}`
        break
        
      case 'memory_summary':
        prompt = `Create a beautiful summary of family memories that celebrates the bond between generations.
        Context: ${context}`
        break
        
      default:
        prompt = `Provide warm, supportive advice about family relationships for elderly users.`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a warm, loving family relationship advisor who helps elderly people stay connected with their families." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.8
    })

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Family assistant error:', error)
    return NextResponse.json({ 
      error: 'Unable to get family assistance right now' 
    }, { status: 500 })
  }
}