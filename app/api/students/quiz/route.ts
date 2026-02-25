import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { StudentModel } from "@/lib/models/student"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, name, email, topicScores, totalCorrect, totalQuestions, material, subject } =
      body

    if (!userId || !name || !email) {
      return NextResponse.json({ error: "Missing required user fields" }, { status: 400 })
    }
    if (!topicScores || totalCorrect === undefined || totalQuestions === undefined) {
      return NextResponse.json({ error: "Missing quiz result data" }, { status: 400 })
    }

    await connectToDatabase()

    const quizResult = {
      topicScores,
      totalCorrect,
      totalQuestions,
      material: material || "",
      subject: subject || "computer-science",
      timestamp: new Date(),
    }

    // Upsert: create student if not exists, push quiz result to array
    const student = await StudentModel.findOneAndUpdate(
      { userId },
      {
        $set: { name, email, lastActive: new Date() },
        $setOnInsert: { createdAt: new Date() },
        $push: { quizResults: quizResult },
      },
      { upsert: true, new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      studentId: student._id,
      totalQuizzes: student.quizResults.length,
    })
  } catch (error) {
    console.error("Error saving quiz result:", error)
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 })
  }
}
