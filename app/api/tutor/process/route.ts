import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { notes, language } = await req.json()

    if (!notes || !language) {
      return NextResponse.json({ error: "Notes and language are required" }, { status: 400 })
    }

    const truncatedNotes = notes.slice(0, 4000)

    const simplifiedResult = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert tutor. Simplify the following study material into easy-to-understand language. Break down complex concepts, use analogies, and make it accessible for a student who is learning this topic for the first time. Keep it concise but thorough.\n\nMaterial:\n${truncatedNotes}`,
    })

    const translatedResult = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Translate the following simplified explanation into ${language}. Make it natural and easy to understand for a native ${language} speaker. Maintain the educational tone.\n\nText to translate:\n${simplifiedResult.text}`,
    })

    return NextResponse.json({
      simplified: simplifiedResult.text,
      translated: translatedResult.text,
    })
  } catch (error) {
    console.error("Tutor process error:", error)
    return NextResponse.json(
      { error: "Failed to process material. Please try again." },
      { status: 500 }
    )
  }
}
