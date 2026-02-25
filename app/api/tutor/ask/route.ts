import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { question, notes, chatHistory } = await req.json()

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    const truncatedNotes = (notes || "").slice(0, 4000)

    const historyContext = (chatHistory || [])
      .slice(-6)
      .map((msg: { role: string; content: string }) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
      .join("\n")

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `You are an expert AI tutor helping a student understand their study material. Answer their question based on the provided material. If the question is unrelated to the material, gently guide them back. Be concise, clear, and educational. Use examples when helpful.

Study Material:
${truncatedNotes || "No specific material provided. Answer based on general knowledge."}

${historyContext ? `Previous conversation:\n${historyContext}\n` : ""}
Student's question: ${question}

Provide a helpful, educational answer:`,
    })

    return NextResponse.json({ answer: result.text })
  } catch (error) {
    console.error("Tutor ask error:", error)
    return NextResponse.json(
      { error: "Failed to generate answer. Please try again." },
      { status: 500 }
    )
  }
}
