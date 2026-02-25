import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { StudentModel } from "@/lib/models/student"

export async function GET() {
  try {
    await connectToDatabase()

    const students = await StudentModel.find({})
      .sort({ lastActive: -1 })
      .lean()

    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
